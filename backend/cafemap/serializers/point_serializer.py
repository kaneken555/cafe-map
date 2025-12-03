"""
統合ポイントシリアライザー

カフェとカスタム地点を統合して返すシリアライザー
"""
from rest_framework import serializers
from cafemap.models import Cafe, CustomPlace
from typing import Dict, Any


class UnifiedPointSerializer(serializers.Serializer):
    """カフェとカスタム地点を統合して返すシリアライザー"""

    type = serializers.CharField()
    id = serializers.IntegerField()
    name = serializers.CharField()
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    image_url = serializers.CharField(allow_null=True, required=False)

    # カフェ固有フィールド（詳細情報取得時のみ）
    place_id = serializers.CharField(required=False)
    rating = serializers.FloatField(allow_null=True, required=False)
    user_ratings_total = serializers.IntegerField(allow_null=True, required=False)
    photo_urls = serializers.ListField(child=serializers.CharField(), required=False)
    address = serializers.CharField(allow_null=True, required=False)
    phone_number = serializers.CharField(allow_null=True, required=False)
    opening_hours = serializers.CharField(allow_null=True, required=False)
    website = serializers.CharField(allow_null=True, required=False)
    price_level = serializers.IntegerField(allow_null=True, required=False)

    # カスタム地点固有フィールド（詳細情報取得時のみ）
    owner = serializers.DictField(required=False)
    place_type = serializers.CharField(allow_null=True, required=False)
    place_type_display = serializers.CharField(allow_null=True, required=False)
    memo = serializers.CharField(allow_null=True, required=False)
    created_at = serializers.DateTimeField(required=False)
    updated_at = serializers.DateTimeField(required=False)
    is_visible = serializers.BooleanField(required=False)

    @staticmethod
    def from_cafe(cafe: Cafe, include_details: bool = False, request=None) -> Dict[str, Any]:
        """
        カフェオブジェクトを統合フォーマットに変換

        Args:
            cafe: Cafeモデルインスタンス
            include_details: 詳細情報を含めるかどうか
            request: リクエストオブジェクト（画像URL生成用）

        Returns:
            統合フォーマットの辞書
        """
        basic = {
            'type': 'cafe',
            'id': cafe.id,
            'name': cafe.name,
            'latitude': float(cafe.latitude) if cafe.latitude else None,
            'longitude': float(cafe.longitude) if cafe.longitude else None,
            'image_url': cafe.photo_urls[0] if cafe.photo_urls and len(cafe.photo_urls) > 0 else None,
        }

        if include_details:
            basic.update({
                'place_id': cafe.place_id,
                'rating': cafe.rating,
                'user_ratings_total': cafe.user_ratings_total,
                'photo_urls': cafe.photo_urls,
                'address': cafe.address,
                'phone_number': cafe.phone_number,
                'opening_hours': cafe.opening_hours,
                'website': cafe.website,
                'price_level': cafe.price_level,
            })

        return basic

    @staticmethod
    def from_custom_place(
        place: CustomPlace,
        include_details: bool = False,
        request=None
    ) -> Dict[str, Any]:
        """
        カスタム地点オブジェクトを統合フォーマットに変換

        Args:
            place: CustomPlaceモデルインスタンス
            include_details: 詳細情報を含めるかどうか
            request: リクエストオブジェクト（画像URL生成用）

        Returns:
            統合フォーマットの辞書
        """
        # 画像URLの構築
        image_url = None
        if place.image:
            if request:
                image_url = request.build_absolute_uri(place.image.url)
            else:
                image_url = place.image.url

        basic = {
            'type': 'custom_place',
            'id': place.id,
            'name': place.name,
            'latitude': place.latitude,
            'longitude': place.longitude,
            'image_url': image_url,
        }

        if include_details:
            basic.update({
                'owner': {
                    'id': place.owner.id,
                    'name': place.owner.name,
                },
                'place_type': place.place_type,
                'place_type_display': place.get_place_type_display() if place.place_type else None,
                'memo': place.memo,
                'created_at': place.created_at.isoformat(),
                'updated_at': place.updated_at.isoformat(),
            })

        return basic


class MapPointsResponseSerializer(serializers.Serializer):
    """マップポイント一覧のレスポンスシリアライザー"""

    map = serializers.DictField()
    points = serializers.ListField(child=serializers.DictField())
    total_count = serializers.IntegerField()
    cafe_count = serializers.IntegerField()
    custom_place_count = serializers.IntegerField()
