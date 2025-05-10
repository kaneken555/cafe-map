from django.urls import path, include
from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth import logout
from . import views
from .views import MapAPIView, MapDetailAPIView, CafeAPIView, CafeDetailAPIView, TagAPIView, TagDetailAPIView, CafeTagAPIView, CafeTagDetailAPIView, CafeMemoAPIView

urlpatterns = [
    # TODO: エンドポイントを修正(RESTful APIの設計に従う)
    path('api/google-maps-key/', views.get_google_maps_api_key, name='google_maps_key'),
    path('api/fetch-cafes/', views.get_cafes, name='cafes'),
    path('api/fetch-cafes/keyword/', views.search_cafes_by_keyword, name='search_cafes_by_keyword'),
    path("api/get-cafe-photo", views.get_cafe_photo, name="get_cafe_photo"),
    path("api/fetch-cafe-detail/", views.get_cafe_detail, name="cafe_detail"),
    path('api/guest-login/', views.guest_login, name='guest-login'),

    # APIViewを使用したエンドポイント
    path('api/maps/', MapAPIView.as_view(), name='maps'),
    path('api/maps/<int:map_id>/', MapDetailAPIView.as_view(), name='map'),
    path('api/maps/<int:map_id>/cafes/', CafeAPIView.as_view(), name='cafes'),
    path('api/maps/<int:map_id>/cafes/<int:cafe_id>/', CafeDetailAPIView.as_view(), name='cafe'),
    path('api/tags/', TagAPIView.as_view(), name='tags'),
    path('api/tags/<int:tag_id>/', TagDetailAPIView.as_view(), name='tag'),
    path('api/maps/<int:map_id>/cafes/<int:cafe_id>/tags/', CafeTagAPIView.as_view(), name='cafe_tags'),
    path('api/maps/<int:map_id>/cafes/<int:cafe_id>/tags/<int:tag_id>/', CafeTagDetailAPIView.as_view(), name='cafe_tag'),
    path('api/maps/<int:map_id>/cafes/<int:cafe_id>/memos/', CafeMemoAPIView.as_view(), name='cafe_memos'),
    path('api/maps/<int:map_id>/cafes/<int:cafe_id>/memos/<int:memo_id>/', CafeMemoAPIView.as_view(), name='cafe_memo'),

    path("api/csrf/", views.csrf_token_view, name="csrf_token"),

    path("api/auth/login/success/", views.login_success_view, name="login_success"),
    path("api/auth/logout/", views.logout_view, name="logout"),
    path("api/auth/login/success-popup/", lambda request: render(request, "popup_login_success.html")),
    path("api/auth/", include("social_django.urls", namespace="social")),

]
