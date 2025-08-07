# services/cafe_services.py
from django.shortcuts import get_object_or_404
from django.core.exceptions import PermissionDenied
from cafemap.models import Map, Cafe, CafeMapRelation, MapUserRelation


def get_cafes_for_map(map_obj):
    cafe_list = Cafe.objects.filter(cafemaprelation__map=map_obj)
    return [
        {
            "id": cafe.id,
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

def get_cafes_for_map_id(map_id: int):
    """指定されたマップに紐づくカフェ一覧を取得"""
    target_map = Map.objects.get(id=map_id)
    cafes = Cafe.objects.filter(cafemaprelation__map=target_map)
    return [{"id": cafe.id, "place_id": cafe.place_id, "name": cafe.name} for cafe in cafes]


def create_cafe_and_relation(map_id: int, cafe_data: dict):
    """カフェの作成とマップとの関連付け"""
    target_map = Map.objects.get(id=map_id)

    # 既存チェック付きでカフェ作成
    cafe, created = Cafe.objects.get_or_create(
        place_id=cafe_data.get("placeId"),
        defaults={
            "name": cafe_data.get("name"),
            "address": cafe_data.get("address"),
            "latitude": cafe_data.get("lat"),
            "longitude": cafe_data.get("lng"),
            "rating": cafe_data.get("rating"),
            "user_ratings_total": cafe_data.get("user_ratings_total"),
            "price_level": cafe_data.get("priceLevel"),
            "photo_reference": cafe_data.get("photo_reference"),
            "photo_url": cafe_data.get("photo_url"),
            "photo_urls": cafe_data.get("photoUrls"),
            "phone_number": cafe_data.get("phoneNumber"),
            "opening_hours": cafe_data.get("openTime"),
            "website": cafe_data.get("website"),
        }
    )

    # 関連レコード作成（なければ）
    CafeMapRelation.objects.get_or_create(map=target_map, cafe=cafe)

    return {
        "id": cafe.id,
        "name": cafe.name,
        "already_existed": not created
    }


def remove_cafe_from_map(user, map_id: int, cafe_id: int) -> None:
    """
    指定されたマップからカフェの紐付けを削除する。
    権限チェックも行う。
    """
    # マップがユーザーのものであることを確認（認可チェック）
    if not MapUserRelation.objects.filter(user=user, map_id=map_id).exists():
        raise PermissionDenied("You do not have permission to modify this map.")

    # CafeMapRelation を取得・削除
    relation = get_object_or_404(CafeMapRelation, map_id=map_id, cafe_id=cafe_id)
    relation.delete()

