from django.urls import path, include
from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth import logout
from . import views
from .views import (
    MapAPIView, MapDetailAPIView, CafeAPIView, CafeDetailAPIView, TagAPIView, TagDetailAPIView, CafeTagAPIView, CafeTagDetailAPIView, CafeMemoAPIView,
    GroupListCreateAPIView, GroupJoinAPIView, GroupMapListAPIView, GroupDetailAPIView,
    SharedMapAPIView,
    UserSharedMapListAPIView,
    SharedMapDetailAPIView,
    RegisterSharedMapAPIView,
    CopySharedMapAPIView,
)
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView


urlpatterns = [
    # TODO: エンドポイントを修正(RESTful APIの設計に従う)
    path('google-maps-key/', views.get_google_maps_api_key, name='google_maps_key'),
    path('fetch-cafes/', views.get_cafes, name='cafes'),
    path('fetch-cafes/keyword/', views.search_cafes_by_keyword, name='search_cafes_by_keyword'),
    path("get-cafe-photo", views.get_cafe_photo, name="get_cafe_photo"),
    path("fetch-cafe-detail/", views.get_cafe_detail, name="cafe_detail"),
    path('guest-login/', views.guest_login, name='guest-login'),

    # APIViewを使用したエンドポイント
    path('maps/', MapAPIView.as_view(), name='maps'),
    path('maps/<int:map_id>/', MapDetailAPIView.as_view(), name='map'),
    path('maps/<int:map_id>/cafes/', CafeAPIView.as_view(), name='cafes'),
    path('maps/<int:map_id>/cafes/<int:cafe_id>/', CafeDetailAPIView.as_view(), name='cafe'),
    path('tags/', TagAPIView.as_view(), name='tags'),
    path('tags/<int:tag_id>/', TagDetailAPIView.as_view(), name='tag'),
    path('maps/<int:map_id>/cafes/<int:cafe_id>/tags/', CafeTagAPIView.as_view(), name='cafe_tags'),
    path('maps/<int:map_id>/cafes/<int:cafe_id>/tags/<int:tag_id>/', CafeTagDetailAPIView.as_view(), name='cafe_tag'),
    path('maps/<int:map_id>/cafes/<int:cafe_id>/memos/', CafeMemoAPIView.as_view(), name='cafe_memos'),
    path('maps/<int:map_id>/cafes/<int:cafe_id>/memos/<int:memo_id>/', CafeMemoAPIView.as_view(), name='cafe_memo'),

    path("csrf/", views.csrf_token_view, name="csrf_token"),

    path("auth/login/success/", views.login_success_view, name="login_success"),
    path("auth/logout/", views.logout_view, name="logout"),
    path("auth/login/success-popup/", lambda request: render(request, "popup_login_success.html")),
    path("auth/", include("social_django.urls", namespace="social")),

    # グループ関連のルーティング
    path('groups/', GroupListCreateAPIView.as_view(), name='group-list-create'),
    path('groups/<uuid:uuid>/join/', GroupJoinAPIView.as_view(), name='group-join'),
    path('groups/<uuid:uuid>/maps/', GroupMapListAPIView.as_view(), name='group-map-list'),
    path("groups/<uuid:uuid>/", GroupDetailAPIView.as_view(), name="group-detail"),

    # シェアマップ関連のルーティング
    path("shared-maps/", SharedMapAPIView.as_view(), name="shared-map"),
    path("shared-maps/check/", SharedMapAPIView.as_view(), name="shared-map-check"),
    path('shared_maps/', UserSharedMapListAPIView.as_view(), name='user-shared-map-list'),
    path('shared-maps/<uuid:uuid>/', SharedMapDetailAPIView.as_view(), name='shared_map_detail'),
    path('shared-maps/<uuid:uuid>/register/', RegisterSharedMapAPIView.as_view(), name='register_shared_map'),
    path("shared-maps/<uuid:uuid>/copy/", CopySharedMapAPIView.as_view(), name="copy_shared_map"),

    # OpenAPIスキーマ(JSON形式)
    path('schema/', SpectacularAPIView.as_view(), name='schema'),
    # Swagger UI（OpenAPIスキーマをもとにAPIドキュメントを表示）
    path('schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    # ReDoc（別のUIスタイル）
    path('schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]
