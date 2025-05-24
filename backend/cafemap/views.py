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
from .models import User, Map, Cafe, Tag, MapUserRelation, CafeMapRelation, Group, UserGroupRelation, GroupMapRelation, SharedMap, CafeSharedMapRelation, UserSharedMapRelation
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token
from uuid import UUID


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
        return JsonResponse({"error": "Missing keyword or location"}, status=400)

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
        return JsonResponse({"error": "Google API error"}, status=500)

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
        return JsonResponse({"error": "Failed to fetch photo"}, status=500)
    
    
def get_cafe_detail(request):
    place_id = request.GET.get("place_id")
    if not place_id:
        return JsonResponse({"error": "place_id is required"}, status=400)

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
    return JsonResponse({"error": "Failed to fetch cafe details"}, status=500)


@api_view(['POST'])
@permission_classes([AllowAny])  # ✅ 認証なしでもアクセス可能にする
@csrf_exempt  # CSRF チェックを無効化
def guest_login(request):
    print("✅ ゲストログイン API が呼ばれました")

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
        return JsonResponse({"error": "未ログインです"}, status=401)

    return JsonResponse({
        "id": request.user.id,
        "name": request.user.get_username()
    })


# マップ登録・一覧取得用のAPIViewを実装
# TODO: MapAPIViewとMapDetailAPIViewを実装
# /api/maps/
class MapAPIView(APIView):
    # # TODO: 認証つける(↓現在は認証なしで登録可能)
    # permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        """ マップの一覧を取得 """
        if not request.user.is_authenticated:
            return Response({"error": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            # ログインユーザーに関連するマップのみ取得
            maps = Map.objects.filter(mapuserrelation__user=request.user)
            data = [{"id": m.id, "name": m.name} for m in maps]
            print(f"📌 リクエストユーザー: {request.user}")  # ✅ ユーザーをログに出す
            print(f"maps: {maps}")  # ✅ マップをログに出す
            print(f"📌 マップ一覧: {data}")  # ✅ マップ一覧をログに出す
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": "Internal Server Error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, *args, **kwargs):
        """ 新しいマップを作成（特定のユーザーに紐づく）  """
        print(f"📌 リクエストユーザー: {request.user}")  # ✅ ユーザーをログに出す

        if not request.user.is_authenticated:
            return Response({"error": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)
        try:
            # マップ名をリクエストから取得
            map_name = request.data.get("name")
            if not map_name:
                return Response({"error": "name is required"}, status=status.HTTP_400_BAD_REQUEST)

            # マップを作成
            new_map = Map.objects.create(name=map_name)

            # ユーザーとマップの関連を登録
            MapUserRelation.objects.create(user=request.user, map=new_map)
            return Response({"id": new_map.id, "name": new_map.name}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"error": "Internal Server Error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# /api/maps/<int:map_id>/
class MapDetailAPIView(APIView):
    def get(self, request, *args, **kwargs):
        """ 特定のマップを取得 """
        try:
            map_id = kwargs.get("map_id")
            target_map = Map.objects.get(id=map_id)
            cafe_list = Cafe.objects.filter(cafemaprelation__map=target_map)
            data = {
                "id": target_map.id,
                "name": target_map.name,
                "cafes": [
                    {"id": cafe.id, 
                     "place_id": cafe.place_id, 
                     "name": cafe.name, 
                     "photo_urls": cafe.photo_urls,
                     "rating": cafe.rating,
                     "phone_number": cafe.phone_number,
                     "address": cafe.address,
                     "opening_hours": cafe.opening_hours,
                     "website": cafe.website,
                     "latitude": cafe.latitude, 
                     "longitude": cafe.longitude,
                     "price_level": cafe.price_level,
                    } 
                     for cafe in cafe_list
                ]
            }
            return Response(data, status=status.HTTP_200_OK)
        except Map.DoesNotExist:
            return Response({"error": "Map not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": "Internal Server Error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, *args, **kwargs):
        """ マップ情報を更新 """
        return Response({"message": "PUT request received"}, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        """ マップ情報を削除 """
        map_id = kwargs.get("map_id")
        if not map_id:
            return Response({"error": "Map ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            map_obj = Map.objects.get(id=map_id)

            # 関連レコード削除
            MapUserRelation.objects.filter(map=map_obj).delete()
            map_obj.delete()

            return Response({"message": "Map deleted"}, status=status.HTTP_204_NO_CONTENT)
        except Map.DoesNotExist:
            return Response({"error": "Map not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": "Internal Server Error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# カフェ登録・一覧取得用のAPIViewを実装
# TODO: CafeAPIViewとCafeDetailAPIViewを実装
# /api/maps/<int:map_id>/cafes/
class CafeAPIView(APIView):
    # # TODO: 認証つける(↓現在は認証なしで登録可能)
    # permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        """ カフェの一覧を取得 """
        try: 
            # マップが存在するか確認
            map_id = kwargs.get("map_id")
            target_map = Map.objects.get(id=map_id)
            
            # カフェ一覧を取得
            # cafes = target_map.cafes.all()
            # ✅ CafeMapRelation を経由してカフェを取得
            cafes = Cafe.objects.filter(cafemaprelation__map=target_map)
            data = [{"id": cafe.id, "place_id": cafe.place_id, "name": cafe.name} for cafe in cafes]
            return Response(data, status=status.HTTP_200_OK)
        
        except Map.DoesNotExist:
            return Response({"error": "Map not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": "Internal Server Error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def post(self, request, *args, **kwargs):
        """ 新しいカフェを作成 """
        try: 
            # TODO: フィールドの修正
            # リクエストから必要な情報を取得
            map_id = kwargs.get("map_id")
            place_id = request.data.get("placeId")
            name = request.data.get("name")
            address = request.data.get("address")
            latitude = request.data.get("lat")
            longitude = request.data.get("lng")
            rating = request.data.get("rating")
            user_ratings_total = request.data.get("user_ratings_total")
            price_level = request.data.get("priceLevel")
            photo_reference = request.data.get("photo_reference")
            photo_url = request.data.get("photo_url")
            photo_urls = request.data.get("photoUrls")
            phone_number = request.data.get("phoneNumber")
            opening_hours = request.data.get("openTime")
            website = request.data.get("website")
            
            # マップが存在するか確認
            target_map = Map.objects.get(id=map_id)
            
            # 1. カフェ本体を作成
            # ✅ まずカフェが存在するかチェック
            cafe, created = Cafe.objects.get_or_create(
                place_id=place_id,
                defaults={
                    "name": name,
                    "address": address,
                    "latitude": latitude,
                    "longitude": longitude,
                    "rating": rating,
                    "user_ratings_total": user_ratings_total,
                    "price_level": price_level,
                    "photo_reference": photo_reference,
                    "photo_url": photo_url,
                    "photo_urls": photo_urls,
                    "phone_number": phone_number,
                    "opening_hours": opening_hours,
                    "website": website,
                    
                }
            )
            # 2. Map と Cafe の関連を作成（中間テーブルへの登録）
            # ✅ カフェとマップの関連もチェックしてから作成
            relation, relation_created = CafeMapRelation.objects.get_or_create(
                map=target_map,
                cafe=cafe
            )
            
            return Response({
                "id": cafe.id,
                "name": cafe.name,
                "already_existed": not created  # 👈 作ったかどうかをレスポンスで返してもいい
            }, status=status.HTTP_200_OK)
        
        except Map.DoesNotExist:
            return Response({"error": "Map not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": "Internal Server Error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# /api/maps/<int:map_id>/cafes/<int:cafe_id>/
class CafeDetailAPIView(APIView):
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
        """ カフェ情報を削除 """
        return Response({"message": "DELETE request received"}, status=status.HTTP_204_NO_CONTENT)
    

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



class GroupListCreateAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """ログインユーザーが所属するグループ一覧を取得"""
        groups = Group.objects.filter(usergrouprelation__user=request.user)
        data = [{"id": g.id, "uuid": str(g.uuid), "name": g.name, "description": g.description} for g in groups]
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request):
        """新しいグループを作成し、作成者を所属させる"""
        name = request.data.get("name")
        description = request.data.get("description", "")

        if not name:
            return Response({"error": "name is required"}, status=status.HTTP_400_BAD_REQUEST)

        group = Group.objects.create(name=name, description=description)
        UserGroupRelation.objects.create(user=request.user, group=group)
        return Response({"id": group.id, "name": group.name}, status=status.HTTP_201_CREATED)


class GroupJoinAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, uuid: UUID):
        """グループに参加（招待URLを経由して）"""
        group = get_object_or_404(Group, uuid=uuid)
        UserGroupRelation.objects.get_or_create(user=request.user, group=group)
        return Response({"message": f"Joined group {group.name}"}, status=status.HTTP_200_OK)


class GroupMapListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, uuid: UUID):
        """指定したグループに属するマップの一覧を取得"""
        group = get_object_or_404(Group, uuid=uuid)
        # グループに属していないユーザーがアクセスしないようチェック
        if not UserGroupRelation.objects.filter(user=request.user, group=group).exists():
            return Response({"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)

        maps = Map.objects.filter(groupmaprelation__group=group)
        data = [{"id": m.id, "name": m.name} for m in maps]
        return Response(data, status=status.HTTP_200_OK)


    def post(self, request, uuid: UUID):
        """指定グループにマップを作成して紐付け"""
        group = get_object_or_404(Group, uuid=uuid)

        if not UserGroupRelation.objects.filter(user=request.user, group=group).exists():
            return Response({"error": "Access denied"}, status=status.HTTP_403_FORBIDDEN)

        name = request.data.get("name")
        if not name:
            return Response({"error": "name is required"}, status=status.HTTP_400_BAD_REQUEST)

        # マップ作成
        map_obj = Map.objects.create(name=name)
        # 中間テーブル登録
        GroupMapRelation.objects.create(group=group, map=map_obj)

        return Response({"id": map_obj.id, "name": map_obj.name}, status=status.HTTP_201_CREATED)


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
            shared_map = SharedMap.objects.filter(
                original_map__id=map_id,
                creator=request.user
            ).first()

            if shared_map:
                return Response({
                    "shared": True,
                    "share_uuid": str(shared_map.share_uuid),
                    "title": shared_map.title
                }, status=status.HTTP_200_OK)
            else:
                return Response({"shared": False}, status=status.HTTP_200_OK)

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
            original_map = get_object_or_404(Map, id=map_id)

            # 既にシェア済みならそれを返す（任意仕様）
            existing = SharedMap.objects.filter(
                original_map=original_map,
                creator=request.user
            ).first()
            if existing:
                return Response({
                    "share_uuid": str(existing.share_uuid),
                    "title": existing.title,
                }, status=status.HTTP_200_OK)

            # SharedMap作成
            shared_map = SharedMap.objects.create(
                original_map=original_map,
                creator=request.user,
                title=title or original_map.name,
                description=description,
            )

            # 関連するカフェをコピー（CafeMapRelation から取得）
            cafes = Cafe.objects.filter(cafemaprelation__map=original_map).distinct()
            for cafe in cafes:
                CafeSharedMapRelation.objects.create(
                    shared_map=shared_map,
                    cafe=cafe
                )

            return Response({
                "share_uuid": str(shared_map.share_uuid),
                "title": shared_map.title,
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {"error": "Internal Server Error", "message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        

class UserSharedMapListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """ログインユーザーが登録したシェアマップの一覧を取得"""
        maps = SharedMap.objects.filter(usersharedmaprelation__user=request.user).distinct()
        data = [{"id": m.id, "name": m.title, "uuid": m.share_uuid} for m in maps]

        return Response(data, status=status.HTTP_200_OK)
    

class SharedMapDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, uuid: UUID):
        """指定したUUIDのシェアマップを取得"""
        try:
            shared_map = SharedMap.objects.get(share_uuid=uuid)
            cafe_list = Cafe.objects.filter(cafesharedmaprelation__shared_map=shared_map)
            data = {
                "id": shared_map.id,
                "name": shared_map.title,
                "cafes": [
                    {"id": cafe.id, 
                        "place_id": cafe.place_id, 
                        "name": cafe.name, 
                        "photo_urls": cafe.photo_urls,
                        "rating": cafe.rating,
                        "phone_number": cafe.phone_number,
                        "address": cafe.address,
                        "opening_hours": cafe.opening_hours,
                        "website": cafe.website,
                        "latitude": cafe.latitude, 
                        "longitude": cafe.longitude,
                        "price_level": cafe.price_level,
                    } 
                        for cafe in cafe_list
                ]
            }
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
            shared_map = get_object_or_404(SharedMap, share_uuid=uuid)

            # すでに登録済みかチェック
            relation, created = UserSharedMapRelation.objects.get_or_create(
                user=request.user,
                shared_map=shared_map
            )

            if created:
                return Response({
                    "message": "シェアマップをマイマップとして登録しました"
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    "message": "すでに登録済みのシェアマップです"
                }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "error": "Internal Server Error",
                "message": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CopySharedMapAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, uuid: UUID):
        try:
            shared_map = SharedMap.objects.get(share_uuid=uuid)
            new_name = request.data.get("name", shared_map.title or "シェアマップのコピー")

            # 1. 新しいマップを作成
            new_map = Map.objects.create(name=new_name)

            # 2. ユーザーとマップの関係を作成
            MapUserRelation.objects.create(user=request.user, map=new_map)

            # 3. カフェをコピーして紐づける
            cafes = Cafe.objects.filter(cafesharedmaprelation__shared_map=shared_map)
            for cafe in cafes:
                CafeMapRelation.objects.create(map=new_map, cafe=cafe)

            return Response({"id": new_map.id, "name": new_map.name}, status=201)

        except SharedMap.DoesNotExist:
            return Response({"error": "Shared Map not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
