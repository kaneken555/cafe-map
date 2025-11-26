from django.test import TestCase, Client
from unittest.mock import patch, MagicMock
import json


class CafeBatchAPITestCase(TestCase):
    """バッチAPIのテストケース"""

    def setUp(self):
        """テストの前準備"""
        self.client = Client()
        self.batch_url = '/api/v1/fetch-cafes-details-batch/'

    @patch('cafemap.api.v1.views.fetch_multiple_cafe_details')
    def test_batch_api_success(self, mock_fetch):
        """正常系: 複数のplace_idで詳細取得"""
        # モックの戻り値を設定
        mock_fetch.return_value = [
            {
                "name": "テストカフェ1",
                "place_id": "ChIJ1",
                "address": "東京都渋谷区",
                "rating": 4.5,
                "latitude": 35.6812,
                "longitude": 139.7671,
            },
            {
                "name": "テストカフェ2",
                "place_id": "ChIJ2",
                "address": "東京都新宿区",
                "rating": 4.0,
                "latitude": 35.6895,
                "longitude": 139.6917,
            }
        ]

        place_ids = ["ChIJ1", "ChIJ2"]

        response = self.client.post(
            self.batch_url,
            data=json.dumps({"place_ids": place_ids}),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("cafes", data)
        self.assertIn("count", data)
        self.assertEqual(data["count"], 2)
        self.assertIsInstance(data["cafes"], list)
        self.assertEqual(len(data["cafes"]), 2)

    def test_batch_api_empty_place_ids(self):
        """異常系: place_idsが空"""
        response = self.client.post(
            self.batch_url,
            data=json.dumps({"place_ids": []}),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertIn("error", data)

    def test_batch_api_missing_place_ids(self):
        """異常系: place_idsが存在しない"""
        response = self.client.post(
            self.batch_url,
            data=json.dumps({}),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertIn("error", data)

    def test_batch_api_too_many_place_ids(self):
        """異常系: place_idsが50件以上"""
        place_ids = [f"ChIJ{i}" for i in range(51)]

        response = self.client.post(
            self.batch_url,
            data=json.dumps({"place_ids": place_ids}),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertIn("error", data)
        self.assertIn("Maximum 50", data["error"])

    def test_batch_api_invalid_json(self):
        """異常系: 無効なJSON"""
        response = self.client.post(
            self.batch_url,
            data="invalid json",
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertIn("error", data)

    def test_batch_api_invalid_place_ids_type(self):
        """異常系: place_idsが配列でない"""
        response = self.client.post(
            self.batch_url,
            data=json.dumps({"place_ids": "not_an_array"}),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 400)
        data = response.json()
        self.assertIn("error", data)
        self.assertIn("must be an array", data["error"])

    @patch('cafemap.api.v1.views.fetch_multiple_cafe_details')
    def test_batch_api_partial_failure(self, mock_fetch):
        """部分的な失敗: 一部のplace_idが失敗しても他は返す"""
        # 3つのうち2つだけ成功するケース
        mock_fetch.return_value = [
            {"name": "カフェ1", "place_id": "ChIJ1"},
            {"name": "カフェ2", "place_id": "ChIJ2"},
        ]

        place_ids = ["ChIJ1", "ChIJ2", "ChIJ3"]  # ChIJ3は失敗する想定

        response = self.client.post(
            self.batch_url,
            data=json.dumps({"place_ids": place_ids}),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["count"], 2)  # 2つだけ成功
