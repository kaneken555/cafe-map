"""
統合ポイントAPIのテスト
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

from cafemap.models import (
    Map, Cafe, CustomPlace,
    CafeMapRelation, CustomPlaceMapRelation,
    MapUserRelation
)

User = get_user_model()


class MapPointsAPITest(TestCase):
    """統合ポイントAPIのテストケース"""

    def setUp(self):
        """テストデータの準備"""
        self.client = APIClient()
        self.user = User.objects.create_user(name='testuser')
        self.client.force_authenticate(user=self.user)

        # テスト用マップを作成
        self.map = Map.objects.create(name='Test Map')
        MapUserRelation.objects.create(user=self.user, map=self.map)

        # カフェを作成
        self.cafe = Cafe.objects.create(
            place_id='test_place_id_1',
            name='Test Cafe',
            address='Test Address',
            latitude=35.6590,
            longitude=139.7004,
            rating=4.5,
            user_ratings_total=100,
            photo_urls=['https://example.com/photo1.jpg'],
        )
        CafeMapRelation.objects.create(map=self.map, cafe=self.cafe)

        # カスタム地点を作成
        self.custom_place = CustomPlace.objects.create(
            owner=self.user,
            name='Test Custom Place',
            latitude=35.6890,
            longitude=139.7020,
            place_type='photo_spot',
            memo='Test memo',
        )
        CustomPlaceMapRelation.objects.create(
            map=self.map,
            custom_place=self.custom_place,
            is_visible=True
        )

    def test_get_points_basic(self):
        """基本情報のみ取得するテスト"""
        response = self.client.get(f'/api/v1/maps/{self.map.id}/points/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        # レスポンス構造の確認
        self.assertIn('map', data)
        self.assertIn('points', data)
        self.assertIn('total_count', data)
        self.assertIn('cafe_count', data)
        self.assertIn('custom_place_count', data)

        # カウントの確認
        self.assertEqual(data['total_count'], 2)
        self.assertEqual(data['cafe_count'], 1)
        self.assertEqual(data['custom_place_count'], 1)

        # マップ情報の確認
        self.assertEqual(data['map']['id'], self.map.id)
        self.assertEqual(data['map']['name'], self.map.name)

        # カフェポイントの基本情報確認
        cafe_point = next(p for p in data['points'] if p['type'] == 'cafe')
        self.assertEqual(cafe_point['id'], self.cafe.id)
        self.assertEqual(cafe_point['name'], self.cafe.name)
        self.assertEqual(cafe_point['latitude'], float(self.cafe.latitude))
        self.assertEqual(cafe_point['longitude'], float(self.cafe.longitude))
        self.assertIn('image_url', cafe_point)
        # 詳細情報は含まれない
        self.assertNotIn('place_id', cafe_point)
        self.assertNotIn('address', cafe_point)

        # カスタム地点の基本情報確認
        custom_point = next(p for p in data['points'] if p['type'] == 'custom_place')
        self.assertEqual(custom_point['id'], self.custom_place.id)
        self.assertEqual(custom_point['name'], self.custom_place.name)
        self.assertEqual(custom_point['latitude'], self.custom_place.latitude)
        self.assertEqual(custom_point['longitude'], self.custom_place.longitude)
        self.assertEqual(custom_point['is_visible'], True)
        # 詳細情報は含まれない
        self.assertNotIn('memo', custom_point)
        self.assertNotIn('owner', custom_point)

    def test_get_points_detailed(self):
        """詳細情報込みで取得するテスト"""
        response = self.client.get(
            f'/api/v1/maps/{self.map.id}/points/?fields=detailed'
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        # カフェポイントの詳細情報確認
        cafe_point = next(p for p in data['points'] if p['type'] == 'cafe')
        self.assertIn('place_id', cafe_point)
        self.assertEqual(cafe_point['place_id'], self.cafe.place_id)
        self.assertEqual(cafe_point['rating'], self.cafe.rating)
        self.assertEqual(cafe_point['address'], self.cafe.address)
        self.assertEqual(cafe_point['photo_urls'], self.cafe.photo_urls)

        # カスタム地点の詳細情報確認
        custom_point = next(p for p in data['points'] if p['type'] == 'custom_place')
        self.assertIn('memo', custom_point)
        self.assertEqual(custom_point['memo'], self.custom_place.memo)
        self.assertIn('owner', custom_point)
        self.assertEqual(custom_point['owner']['id'], self.user.id)
        self.assertEqual(custom_point['owner']['name'], self.user.name)
        self.assertEqual(custom_point['place_type'], 'photo_spot')
        self.assertIn('place_type_display', custom_point)

    def test_get_points_visible_only(self):
        """表示中のカスタム地点のみ取得するテスト"""
        # 非表示のカスタム地点を追加
        invisible_place = CustomPlace.objects.create(
            owner=self.user,
            name='Invisible Place',
            latitude=35.7000,
            longitude=139.7100,
        )
        CustomPlaceMapRelation.objects.create(
            map=self.map,
            custom_place=invisible_place,
            is_visible=False
        )

        # visible_only=true で取得
        response = self.client.get(
            f'/api/v1/maps/{self.map.id}/points/?visible_only=true'
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        # カフェは含まれる
        self.assertEqual(data['cafe_count'], 1)
        # 表示中のカスタム地点のみ含まれる
        self.assertEqual(data['custom_place_count'], 1)
        self.assertEqual(data['total_count'], 2)

        custom_places = [p for p in data['points'] if p['type'] == 'custom_place']
        self.assertEqual(len(custom_places), 1)
        self.assertEqual(custom_places[0]['name'], 'Test Custom Place')

    def test_get_points_map_not_found(self):
        """存在しないマップIDでのテスト"""
        response = self.client.get('/api/v1/maps/99999/points/')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_points_unauthorized(self):
        """未認証ユーザーでのテスト"""
        # 認証を解除
        self.client.force_authenticate(user=None)

        response = self.client.get(f'/api/v1/maps/{self.map.id}/points/')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_points_empty_map(self):
        """地点が何もないマップのテスト"""
        empty_map = Map.objects.create(name='Empty Map')
        MapUserRelation.objects.create(user=self.user, map=empty_map)

        response = self.client.get(f'/api/v1/maps/{empty_map.id}/points/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        self.assertEqual(data['total_count'], 0)
        self.assertEqual(data['cafe_count'], 0)
        self.assertEqual(data['custom_place_count'], 0)
        self.assertEqual(len(data['points']), 0)
