import os
import requests
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import login, logout 
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from cafemap.models import User, Map, Tag, Group, SharedMap, CafeMapRelation
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token
from rest_framework.exceptions import PermissionDenied
from uuid import UUID

from cafemap.services.map_services import get_maps_for_user, create_map_for_user, get_map_with_cafes, delete_map_with_relations, get_maps_for_group, create_map_for_group, update_map_info
from cafemap.services.cafe_services import get_cafes_for_map_id, create_cafe_and_relation, remove_cafe_from_map
from cafemap.services.group_services import get_groups_for_user, create_group_with_user, join_group_by_uuid, user_in_group, delete_group_and_relations, get_group_detail, update_group
from cafemap.services.shared_map_services import get_shared_map_info, create_or_get_shared_map, get_shared_maps_for_user, get_shared_map_detail, register_shared_map_for_user, copy_shared_map_to_user

import logging

logger = logging.getLogger(__name__)  # ← ファイル名に対応したロガーを使う


GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")


def get_google_maps_api_key(request):
    api_key = GOOGLE_MAPS_API_KEY
    return JsonResponse({"apiKey": api_key})


def get_cafes(request):
    lat = request.GET.get("lat")
    lng = request.GET.get("lng")
    radius = 1000  # 1km以内のカフェを検索

    url = f"https://maps.googleapis.com/maps/api/place/nearbysearch/json"
    params = {
        "location": f"{lat},{lng}",
        "radius": radius,
        "type": "cafe",
        "key": GOOGLE_MAPS_API_KEY,
    }

    response = requests.get(url, params=params)
    results = response.json().get("results", [])

    cafes = [
        {"lat": place["geometry"]["location"]["lat"],
         "lng": place["geometry"]["location"]["lng"],
         "name": place["name"],
         "place_id": place["place_id"],
         "photo_reference": place.get("photos", [{}])[0].get("photo_reference", ""),
         }
        for place in results
    ]

    return JsonResponse({"cafes": cafes})


def search_cafes_by_keyword(request):
    query = request.GET.get("q")
    lat = request.GET.get("lat")
    lng = request.GET.get("lng")

    if not query or not lat or not lng:
        return JsonResponse({"error": "Missing keyword or location"}, status=status.HTTP_400_BAD_REQUEST)

    url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
    params = {
        "query": query,
        "location": f"{lat},{lng}",
        "radius": 1000,  # メートル単位
        "type": "cafe",
        "language": "ja",
        "key": GOOGLE_MAPS_API_KEY,
    }

    response = requests.get(url, params=params)
    if response.status_code != 200:
        return JsonResponse({"error": "Google API error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    results = response.json().get("results", [])

    cafes = [
        {
            "lat": place["geometry"]["location"]["lat"],
            "lng": place["geometry"]["location"]["lng"],
            "name": place["name"],
            "place_id": place["place_id"],
            "photo_reference": place.get("photos", [{}])[0].get("photo_reference", ""),
        }
        for place in results
    ]

    return JsonResponse({"cafes": cafes})


@csrf_exempt
def get_cafe_photo(request):
    photo_reference = request.GET.get("photo_reference")
    
    if not photo_reference:
        return JsonResponse({"photo_url": None})

    # TODO: フォーマットを修正
    photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference={photo_reference}&key={GOOGLE_MAPS_API_KEY}"
    response = requests.get(photo_url, stream=True)

    if response.status_code == 200:
        # Google Maps API から取得した画像データをそのまま返す
        return HttpResponse(response.content, content_type=response.headers['Content-Type'])
    else:
        return JsonResponse({"error": "Failed to fetch photo"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
def get_cafe_detail(request):
    place_id = request.GET.get("place_id")
    if not place_id:
        return JsonResponse({"error": "place_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    url = "https://maps.googleapis.com/maps/api/place/details/json"
    params = {
        "place_id": place_id,
        "fields": (
            "name,"
            "formatted_address,"
            "formatted_phone_number,"
            "website,"
            "opening_hours,"
            "photos,"
            "geometry,"
            "rating,"
            "user_ratings_total,"
            "business_status,"
            "price_level"
        ),
        "language": "ja",
        "key": GOOGLE_MAPS_API_KEY,
    }

    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        data = response.json()
        if data.get("status") == "OK":
            result = data.get("result", {})
            location = result.get("geometry", {}).get("location", {}) 

            return JsonResponse({
                "name": result.get("name", ""),
                "address": result.get("formatted_address", ""),
                "place_id": place_id,
                "rating": result.get("rating", ""),
                "user_ratings_total": result.get("user_ratings_total", 0),
                "opening_hours": result.get("opening_hours", {}).get("weekday_text", []),
                "photos": [
                    f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo['photo_reference']}&key={GOOGLE_MAPS_API_KEY}"
                    for photo in result.get("photos", [])[:5]
                ],
                "latitude": location.get("lat"),   # ✅ 緯度
                "longitude": location.get("lng"),  # ✅ 経度
                "phone_number": result.get("formatted_phone_number", ""),  # ✅ 電話番号
                "website": result.get("website", ""),                     # ✅ Webサイト
                "business_status": result.get("business_status", ""),  # ✅ 営業状態
                "price_level": result.get("price_level", None),        # ✅ 価格帯（0〜4、またはnull）
            })
    return JsonResponse({"error": "Failed to fetch cafe details"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])  # ✅ 認証なしでもアクセス可能にする
@csrf_exempt  # CSRF チェックを無効化
def guest_login(request):
    logger.info("✅ ゲストログイン API が呼ばれました")  # ← ログ追加

    try:
        # 「ゲストユーザー」を取得（なければ作成する）
        guest_user, created = User.objects.get_or_create(
            name="guest",  # 固定の名前
            defaults={"email": "guest@example.com"}
        )
        
        # 🔑 backend を明示的に指定（複数の認証バックエンドがあるため）
        guest_user.backend = 'django.contrib.auth.backends.ModelBackend'
        # ログイン処理
        login(request, guest_user)

        print(f"ゲストユーザー作成成功: {guest_user.name}")
        return Response({"id": guest_user.id, "name": guest_user.name}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"ゲストログインエラー: {e}")
        return Response({"error": "Internal Server Error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def csrf_token_view(request):
    return JsonResponse({"csrfToken": get_token(request)})

@api_view(['POST'])
def logout_view(request):
    logout(request)
    return JsonResponse({"message": "ログアウトしました"})

def login_success_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "未ログインです"}, status=status.HTTP_401_UNAUTHORIZED)

    return JsonResponse({
        "id": request.user.id,
        "name": request.user.get_username()
    })


# マップ登録・一覧取得用のAPIViewを実装
# TODO: MapAPIViewとMapDetailAPIViewを実装
# /api/maps/
class MapAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """ マップの一覧を取得 """
        try:
            # ログインユーザーに関連するマップのみ取得
            maps = get_maps_for_user(request.user)
            data = [{"id": m.id, "name": m.name} for m in maps]
            logging.info(f"📌 リクエストユーザー: {request.user},maps:{maps},📌 マップ一覧: {data}")
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Internal Server Error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, *args, **kwargs):
        """ 新しいマップを作成（特定のユーザーに紐づく）  """
        try:
            # マップ名をリクエストから取得
            map_name = request.data.get("name")
            if not map_name:
                return Response({"error": "name is required"}, status=status.HTTP_400_BAD_REQUEST)

            # マップを作成
            new_map = create_map_for_user(request.user, map_name)
            return Response({"id": new_map.id, "name": new_map.name}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": "Internal Server Error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# /api/maps/<int:map_id>/
class MapDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """ 特定のマップを取得 """
        logging.info(f"📌 リクエストユーザー: {request.user}, マップID: {kwargs.get('map_id')}")  # ログに出力
        try:
            map_id = kwargs.get("map_id")
            data = get_map_with_cafes(map_id)
            return Response(data, status=status.HTTP_200_OK)
        except Map.DoesNotExist:
            return Response({"error": "Map not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": "Internal Server Error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request, *args, **kwargs):
        """ マップ情報を更新 """
        map_id = kwargs.get("map_id")
        if not map_id:
            return Response({"error": "Map ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            updated_map = update_map_info(request, map_id)
            return Response(updated_map, status=status.HTTP_200_OK)
        except Map.DoesNotExist:
            return Response({"error": "Map not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": "Internal Server Error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request, *args, **kwargs):
        """ マップ情報を削除 """
        map_id = kwargs.get("map_id")
        if not map_id:
            return Response({"error": "Map ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            delete_map_with_relations(map_id)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Map.DoesNotExist:
            return Response({"error": "Map not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": "Internal Server Error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# カフェ登録・一覧取得用のAPIViewを実装
# TODO: CafeAPIViewとCafeDetailAPIViewを実装
# /api/maps/<int:map_id>/cafes/
class CafeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """ カフェの一覧を取得 """
        try: 
            # マップが存在するか確認
            map_id = kwargs.get("map_id")
            data = get_cafes_for_map_id(map_id)
            return Response(data, status=status.HTTP_200_OK)
        
        except Map.DoesNotExist:
            return Response({"error": "Map not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": "Internal Server Error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request, *args, **kwargs):
        """ 新しいカフェを作成 """
        try: 
            # TODO: フィールドの修正
            map_id = kwargs.get("map_id")
            result = create_cafe_and_relation(map_id, request.data)
            return Response(result, status=status.HTTP_200_OK)
        
        except Map.DoesNotExist:
            return Response({"error": "Map not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": "Internal Server Error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# /api/maps/<int:map_id>/cafes/<int:cafe_id>/
class CafeDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """ 特定のカフェを取得 """
        return Response({"message": "GET request received"}, status=status.HTTP_200_OK)

    # def post(self, request, *args, **kwargs):
    #     """ 新しいカフェを作成 """
    #     return Response({"message": "POST request received"}, status=status.HTTP_201_CREATED)

    def put(self, request, *args, **kwargs):
        """ カフェ情報を更新 """
        return Response({"message": "PUT request received"}, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        """ マップからカフェの紐付けを削除 """
        map_id = kwargs.get("map_id")
        cafe_id = kwargs.get("cafe_id")
        logging.info(f"📌 リクエストユーザー: {request.user}, マップID: {map_id}, カフェID: {cafe_id}")  # ログに出力

        if not map_id or not cafe_id:
            return Response({"error": "Map ID and Cafe ID are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            remove_cafe_from_map(request.user, map_id, cafe_id)
            return Response(status=status.HTTP_204_NO_CONTENT)

        except PermissionDenied as e:
            return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)

        except CafeMapRelation.DoesNotExist:
            return Response({"error": "Cafe is not associated with this map"}, status=status.HTTP_404_NOT_FOUND)
    

# タグ登録・一覧取得用のAPIViewを実装
# TODO: TagAPIViewとTagDetailAPIViewを実装
# /api/tags/
class TagAPIView(APIView):
    def get(self, request, *args, **kwargs):
        """ タグの一覧を取得 """
        try:
            tags = Tag.objects.all()
            data = [{"id": tag.id, "name": tag.name} for tag in tags]
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Internal Server Error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request, *args, **kwargs):
        """ 新しいタグを作成 """
        return Response({"message": "POST request received"}, status=status.HTTP_201_CREATED)
    
# /api/tags/<int:tag_id>/
class TagDetailAPIView(APIView):
    def get(self, request, *args, **kwargs):
        """ 特定のタグを取得 """
        return Response({"message": "GET request received"}, status=status.HTTP_200_OK)
    
    def put(self, request, *args, **kwargs):
        """ タグ情報を更新 """
        return Response({"message": "PUT request received"}, status=status.HTTP_200_OK)
    
    def delete(self, request, *args, **kwargs):
        """ タグ情報を削除 """
        return Response({"message": "DELETE request received"}, status=status.HTTP_204_NO_CONTENT)
    


# カフェのタグ登録・一覧取得用のAPIViewを実装
# TODO: CafeTagAPIViewとCafeTagDetailAPIViewを実装
# /api/maps/<int:map_id>/cafes/<int:cafe_id>/tags/
class CafeTagAPIView(APIView):
    def get(self, request, *args, **kwargs):
        """ カフェのタグ一覧を取得 """
        return Response({"message": "GET request received"}, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        """ カフェにタグを追加 """
        return Response({"message": "POST request received"}, status=status.HTTP_201_CREATED)
    
# /api/maps/<int:map_id>/cafes/<int:cafe_id>/tags/<int:tag_id>/
class CafeTagDetailAPIView(APIView):
    def delete(self, request, *args, **kwargs):
        """ カフェのタグを削除 """
        return Response({"message": "DELETE request received"}, status=status.HTTP_204_NO_CONTENT)
    

# カフェのメモ登録・一覧取得用のAPIViewを実装
# TODO: CafeMemoAPIViewとCafeMemoDetailAPIViewを実装
# /api/maps/<int:map_id>/cafes/<int:cafe_id>/memos/
class CafeMemoAPIView(APIView):
    def get(self, request, *args, **kwargs):
        """ カフェのメモ一覧を取得 """
        return Response({"message": "GET request received"}, status=status.HTTP_200_OK)
    
    def post(self, request, *args, **kwargs):
        """ カフェにメモを追加 """
        return Response({"message": "POST request received"}, status=status.HTTP_201_CREATED)
    

# /api/maps/<int:map_id>/cafes/<int:cafe_id>/memos/<int:memo_id>/
class CafeMemoDetailAPIView(APIView):
    def get(self, request, *args, **kwargs):
        """ 特定のメモを取得 """
        return Response({"message": "GET request received"}, status=status.HTTP_200_OK)
    
    def delete(self, request, *args, **kwargs):
        """ カフェのメモを削除 """
        return Response({"message": "DELETE request received"}, status=status.HTTP_204_NO_CONTENT)


# /api/groups/
class GroupListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """ログインユーザーが所属するグループ一覧を取得"""
        data = get_groups_for_user(request.user)
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        """新しいグループを作成し、作成者を所属させる"""
        name = request.data.get("name")
        description = request.data.get("description", "")

        if not name:
            return Response({"error": "name is required"}, status=status.HTTP_400_BAD_REQUEST)

        result = create_group_with_user(request.user, name, description)
        return Response(result, status=status.HTTP_201_CREATED)


# /api/groups/<uuid:uuid>/memberships/
class GroupMembershipAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, uuid: UUID):
        """グループに参加（招待URLを経由して）"""
        group = join_group_by_uuid(request.user, uuid)
        return Response({"message": f"Joined group {group.name}"}, status=status.HTTP_200_OK)

    # def delete(self, request, uuid: UUID):
    #     group = get_object_or_404(Group, uuid=uuid)
    #     leave_group(request.user, group)
    #     return Response({"message": "Left the group"}, status=status.HTTP_204_NO_CONTENT)


# /api/groups/<uuid:uuid>/maps/
class GroupMapListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, uuid: UUID):
        """指定したグループに属するマップの一覧を取得"""
        group = get_object_or_404(Group, uuid=uuid)
        if not group:
            return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)

        if not user_in_group(request.user, group):
            return Response({"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)

        data = get_maps_for_group(group)
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request, uuid: UUID):
        """指定グループにマップを作成して紐付け"""
        group = get_object_or_404(Group, uuid=uuid)
        if not group:
            return Response({"error": "Group not found"}, status=status.HTTP_404_NOT_FOUND)

        if not user_in_group(request.user, group):
            return Response({"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)

        name = request.data.get("name")
        if not name:
            return Response({"error": "name is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        result = create_map_for_group(group, name)
        return Response(result, status=status.HTTP_201_CREATED)

# /api/groups/<uuid:uuid>/maps/<uuid:uuid>
class GroupMapDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, uuid: UUID):
        """指定したグループに紐づくマップを削除"""
        group = get_object_or_404(Group, uuid=uuid)
        if not user_in_group(request.user, group):
            return Response({"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)

        try:
            delete_map_with_relations(uuid)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": "Internal Server Error", "message": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# /api/groups/<uuid:uuid>/
class GroupDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, uuid: UUID):
        group = get_object_or_404(Group, uuid=uuid)
        if not user_in_group(request.user, group):
            return Response({"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)

        data = get_group_detail(uuid)  # → 例えば { name, description, created_at, member_count, ... }
        return Response(data, status=status.HTTP_200_OK)

    def patch(self, request, uuid: UUID):
        group = get_object_or_404(Group, uuid=uuid)
        if not user_in_group(request.user, group):
            return Response({"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)

        name = request.data.get("name")
        description = request.data.get("description")

        updated_group = update_group(group, name, description)
        return Response({"message": "Group updated"}, status=status.HTTP_200_OK)

    def delete(self, request, uuid: UUID):
        """指定したグループを削除"""
        try:
            group = get_object_or_404(Group, uuid=uuid)

            if not user_in_group(request.user, group):
                return Response({"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)

            delete_group_and_relations(group)

            return Response(status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            return Response({"error": "Internal Server Error", "message": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SharedMapAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        既にシェア済みのマップがあるか確認する（作成はしない）
        GET /api/shared-maps/check/?map_id=1
        """
        map_id = request.GET.get("map_id")
        if not map_id:
            return Response({"error": "map_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            result = get_shared_map_info(map_id, request.user)
            return Response(result, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": "Internal Server Error", "message": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request):
        """
        シェアマップを作成し、関連するカフェも CafeSharedMapRelation に登録する。
        既に同じユーザーが同じマップをシェアしていれば、それを再利用する。
        """
        map_id = request.data.get("map_id")
        title = request.data.get("title", "")
        description = request.data.get("description", "")

        if not map_id:
            return Response({"error": "map_id is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            result = create_or_get_shared_map(map_id, request.user, title, description)
            status_code = status.HTTP_201_CREATED if result.get("created") else status.HTTP_200_OK
            return Response({
                "share_uuid": result["share_uuid"],
                "title": result["title"],
            }, status=status_code)

        except Exception as e:
            return Response({"error": "Internal Server Error", "message": str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

class UserSharedMapListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """ログインユーザーが登録したシェアマップの一覧を取得"""
        data = get_shared_maps_for_user(request.user)
        return Response(data, status=status.HTTP_200_OK)
    

class SharedMapDetailAPIView(APIView):
    permission_classes = [AllowAny]  # 公開シェアマップは認証不要

    def get(self, request, uuid: UUID):
        """指定したUUIDのシェアマップを取得（認証不要）"""
        src = request.GET.get("src")
        logger.info(f"📌 SharedMapDetailAPIView GET called with src: {src}")  # ログに出力
        try:
            data = get_shared_map_detail(uuid)
            return Response(data, status=status.HTTP_200_OK)
        except SharedMap.DoesNotExist:
            return Response({"error": "Shared Map not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": "Internal Server Error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


class RegisterSharedMapAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, uuid: UUID):
        """シェアマップをマイマップとして登録（UserSharedMapRelation に保存）"""
        try:
            result = register_shared_map_for_user(request.user, uuid)
            status_code = status.HTTP_201_CREATED if result["created"] else status.HTTP_200_OK

            return Response({
                "message": result["message"]
            }, status=status_code)

        except Exception as e:
            return Response({
                "error": "Internal Server Error",
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CopySharedMapAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, uuid: UUID):
        try:
            new_name = request.data.get("name")
            result = copy_shared_map_to_user(request.user, uuid, new_name)
            return Response(result, status=status.HTTP_201_CREATED)

        except SharedMap.DoesNotExist:
            return Response({"error": "Shared Map not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
