from django.urls import path
from . import views

urlpatterns = [
    # TODO: エンドポイントを修正(RESTful APIの設計に従う)
    path('api/google-maps-key/', views.get_google_maps_api_key, name='google_maps_key'),
    path('api/cafes/', views.get_cafes, name='cafes'),
    path("api/get-cafe-photo", views.get_cafe_photo, name="get_cafe_photo"),
    path("api/cafe-detail/", views.get_cafe_detail, name="cafe_detail"),

]
