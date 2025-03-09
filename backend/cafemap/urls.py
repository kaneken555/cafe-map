from django.urls import path
from . import views

urlpatterns = [
    path('api/google-maps-key/', views.get_google_maps_api_key, name='google_maps_key'), # `/api/` にアクセスしたときのレスポンス
    path('api/cafes/', views.get_cafes, name='cafes'),  # `/api/cafes/` にアクセスしたときのレスポンス

]
