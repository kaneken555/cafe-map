from django.http import JsonResponse
import os

def get_google_maps_api_key(request):
    api_key = os.getenv("GOOGLE_MAPS_API_KEY", "")
    return JsonResponse({"apiKey": api_key})
