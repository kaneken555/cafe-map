import os
import requests
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.crypto import get_random_string
from django.contrib.auth import login
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from .models import User


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
        "fields": "name,formatted_address,formatted_phone_number,opening_hours,photos",
        "language": "ja",
        "key": GOOGLE_MAPS_API_KEY,
    }

    response = requests.get(url, params=params)
    
    if response.status_code == 200:
        data = response.json()
        if data.get("status") == "OK":
            result = data.get("result", {})
            return JsonResponse({
                "name": result.get("name", ""),
                "address": result.get("formatted_address", ""),
                "place_id": place_id,
                "rating": result.get("rating", ""),
                "opening_hours": result.get("opening_hours", {}).get("weekday_text", []),
                "photos": [
                    f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo['photo_reference']}&key={GOOGLE_MAPS_API_KEY}"
                    for photo in result.get("photos", [])[:5]
                ]
            })
    return JsonResponse({"error": "Failed to fetch cafe details"}, status=500)


@api_view(['POST'])
def guest_login(request):
    try:
        # ゲストユーザーを作成
        guest_name = f"guest_{get_random_string(8)}"
        guest_user = User.objects.create(name=guest_name)

        # ログイン処理
        login(request, guest_user)

        print(f"ゲストユーザー作成成功: {guest_user.name}")  # 追加
        return Response({"name": guest_user.name}, status=status.HTTP_200_OK)

    except Exception as e:
        print(f"ゲストログインエラー: {e}")  # 追加
        return Response({"error": "Internal Server Error", "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# マップ登録・一覧取得用のAPIViewを実装
# TODO: MapAPIViewとMapDetailAPIViewを実装
# /api/maps/
class MapAPIView(APIView):
    def get(self, request, *args, **kwargs):
        """ マップの一覧を取得 """
        return Response({"message": "GET request received"}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """ 新しいマップを作成 """
        return Response({"message": "POST request received"}, status=status.HTTP_201_CREATED)

# /api/maps/<int:map_id>/
class MapDetailAPIView(APIView):
    def get(self, request, *args, **kwargs):
        """ 特定のマップを取得 """
        return Response({"message": "GET request received"}, status=status.HTTP_200_OK)

    def put(self, request, *args, **kwargs):
        """ マップ情報を更新 """
        return Response({"message": "PUT request received"}, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        """ マップ情報を削除 """
        return Response({"message": "DELETE request received"}, status=status.HTTP_204_NO_CONTENT)


# カフェ登録・一覧取得用のAPIViewを実装
# TODO: CafeAPIViewとCafeDetailAPIViewを実装
# /api/maps/<int:map_id>/cafes/
class CafeAPIView(APIView):
    def get(self, request, *args, **kwargs):
        """ カフェの一覧を取得 """
        return Response({"message": "GET request received"}, status=status.HTTP_200_OK)
    
# /api/maps/<int:map_id>/cafes/<int:cafe_id>/
class CafeDetailAPIView(APIView):
    def get(self, request, *args, **kwargs):
        """ 特定のカフェを取得 """
        return Response({"message": "GET request received"}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        """ 新しいカフェを作成 """
        return Response({"message": "POST request received"}, status=status.HTTP_201_CREATED)

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
        return Response({"message": "GET request received"}, status=status.HTTP_200_OK)
    
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