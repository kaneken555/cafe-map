from django.urls import path
from . import views

urlpatterns = [
    path('google-maps-key/', views.get_google_maps_api_key, name='google_maps_key'), # `/api/` にアクセスしたときのレスポンス
]
