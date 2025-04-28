import os
import requests
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.crypto import get_random_string
from django.contrib.auth import login
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from .models import User, Map, Cafe, Tag, MapUserRelation, CafeMapRelation
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token


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
        "fields": "name,formatted_address,formatted_phone_number,opening_hours,photos,geometry,rating,user_ratings_total",
        "language": "ja",
        "key": GOOGLE_MAPS_API_KEY,
    }

    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        data = response.json()
        if data.get("status") == "OK":
            result = data.get("result", {})
            location = result.get("geometry", {}).get("location", {})  # 👈 追加

            return JsonResponse({
                "name": result.get("name", ""),
                "address": result.get("formatted_address", ""),
                "place_id": place_id,
                "rating": result.get("rating", ""),
                "opening_hours": result.get("opening_hours", {}).get("weekday_text", []),
                "photos": [
                    f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo['photo_reference']}&key={GOOGLE_MAPS_API_KEY}"
                    for photo in result.get("photos", [])[:5]
                ],
                "latitude": location.get("lat"),   # ✅ 緯度追加
                "longitude": location.get("lng"),  # ✅ 経度追加
            })
    return JsonResponse({"error": "Failed to fetch cafe details"}, status=500)


@api_view(['POST'])
@permission_classes([AllowAny])  # ✅ 認証なしでもアクセス可能にする
@csrf_exempt  # CSRF チェックを無効化
def guest_login(request):
    print("✅ ゲストログイン API が呼ばれました")  # ✅ 追加

    try:
        # # ゲストユーザーを作成
        # guest_name = f"guest_{get_random_string(8)}"
        # guest_user = User.objects.create(name=guest_name)

        # 「ゲストユーザー」を取得（なければ作成する）
        guest_user, created = User.objects.get_or_create(
            name="ゲストユーザー",  # 固定の名前
            defaults={}
        )

        # ログイン処理
        login(request, guest_user)

        print(f"ゲストユーザー作成成功: {guest_user.name}")  # 追加
        return Response({"id": guest_user.id, "name": guest_user.name}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"ゲストログインエラー: {e}")  # 追加
        return Response({"error": "Internal Server Error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def csrf_token_view(request):
    return JsonResponse({"csrfToken": get_token(request)})


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
                     "latitude": cafe.latitude, 
                     "longitude": cafe.longitude
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
            photo_reference = request.data.get("photo_reference")
            photo_url = request.data.get("photo_url")
            photo_urls = request.data.get("photoUrls")
            phone_number = request.data.get("phone_number")
            opening_hours = request.data.get("opening_hours")
            
            # マップが存在するか確認
            target_map = Map.objects.get(id=map_id)
            
            # 1. カフェ本体を作成
            new_cafe = Cafe.objects.create(
                place_id=place_id,
                name=name,
                address=address,
                latitude=latitude,
                longitude=longitude,
                rating=rating,
                user_ratings_total=user_ratings_total,
                photo_reference=photo_reference,
                photo_url=photo_url,
                photo_urls=photo_urls,
                phone_number=phone_number,
                opening_hours=opening_hours
            )
            # 2. Map と Cafe の関連を作成（中間テーブルへの登録）
            CafeMapRelation.objects.create(
                map=target_map,
                cafe=new_cafe
            )
            
            return Response({"id": new_cafe.id, "name": new_cafe.name}, status=status.HTTP_201_CREATED)
        
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