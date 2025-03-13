from django.http import HttpResponse, JsonResponse
import os
import requests
from django.views.decorators.csrf import csrf_exempt


GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")


def get_google_maps_api_key(request):
    api_key = os.getenv("GOOGLE_MAPS_API_KEY", "")
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
                "rating": result.get("rating", ""),
                "opening_hours": result.get("opening_hours", {}).get("weekday_text", []),
                "photos": [
                    f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo['photo_reference']}&key={GOOGLE_MAPS_API_KEY}"
                    for photo in result.get("photos", [])[:5]
                ]
            })
    return JsonResponse({"error": "Failed to fetch cafe details"}, status=500)