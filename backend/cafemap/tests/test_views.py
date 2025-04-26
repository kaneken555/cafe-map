# backend/cafemap/tests/test_views.py

import pytest
from unittest.mock import patch
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from cafemap.models import Map, Cafe, MapUserRelation, CafeMapRelation

User = get_user_model()

# ---------- get_cafes テスト ----------
@pytest.mark.django_db
@patch("cafemap.views.requests.get")  # Google APIのモック
def test_get_cafes(mock_get):
    # モックレスポンスの設定
    mock_get.return_value.status_code = 200
    mock_get.return_value.json.return_value = {
        "results": [
            {
                "geometry": {
                    "location": {"lat": 35.0, "lng": 139.0}
                },
                "name": "カフェモック",
                "place_id": "abc123",
                "photos": [{"photo_reference": "mock_photo_ref"}],
            }
        ]
    }

    client = APIClient()
    response = client.get("/api/cafes/?lat=35.0&lng=139.0")

    assert response.status_code == 200
    assert "cafes" in response.json()
    cafes = response.json()["cafes"]
    assert len(cafes) == 1
    assert cafes[0]["name"] == "カフェモック"
    assert cafes[0]["place_id"] == "abc123"
    assert cafes[0]["lat"] == 35.0
    assert cafes[0]["lng"] == 139.0


# ---------- get_cafe_photo テスト ----------

@pytest.mark.django_db
def test_get_cafe_photo_no_photo_reference():
    client = APIClient()
    response = client.get("/api/get-cafe-photo")

    assert response.status_code == 200
    assert response.json() == {"photo_url": None}

@pytest.mark.django_db
@patch("cafemap.views.requests.get")
def test_get_cafe_photo_success(mock_get):
    mock_get.return_value.status_code = 200
    mock_get.return_value.content = b'binary image data'
    mock_get.return_value.headers = {'Content-Type': 'image/jpeg'}

    client = APIClient()
    response = client.get("/api/get-cafe-photo?photo_reference=mock_photo_reference")

    assert response.status_code == 200
    assert response["Content-Type"] == "image/jpeg"
    assert response.content == b'binary image data'

@pytest.mark.django_db
@patch("cafemap.views.requests.get")
def test_get_cafe_photo_google_api_failure(mock_get):
    mock_get.return_value.status_code = 500

    client = APIClient()
    response = client.get("/api/get-cafe-photo?photo_reference=mock_photo_reference")

    assert response.status_code == 500
    assert response.json() == {"error": "Failed to fetch photo"}



# ---------- get_cafe_detail テスト ----------

@pytest.mark.django_db
def test_get_cafe_detail_no_place_id():
    client = APIClient()
    response = client.get("/api/cafe-detail/")

    assert response.status_code == 400
    assert response.json() == {"error": "place_id is required"}

@pytest.mark.django_db
@patch("cafemap.views.requests.get")
def test_get_cafe_detail_success(mock_get):
    mock_get.return_value.status_code = 200
    mock_get.return_value.json.return_value = {
        "status": "OK",
        "result": {
            "name": "Mock Cafe",
            "formatted_address": "Mock Address",
            "formatted_phone_number": "000-0000-0000",
            "opening_hours": {
                "weekday_text": ["月曜日: 10:00～18:00"]
            },
            "photos": [{"photo_reference": "mock_photo_ref"}],
            "geometry": {"location": {"lat": 35.0, "lng": 139.0}},
            "rating": 4.5,
            "user_ratings_total": 100,
        }
    }

    client = APIClient()
    response = client.get("/api/cafe-detail/?place_id=mock_place_id")

    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Mock Cafe"
    assert data["address"] == "Mock Address"
    assert data["latitude"] == 35.0
    assert data["longitude"] == 139.0
    assert isinstance(data["photos"], list)

@pytest.mark.django_db
@patch("cafemap.views.requests.get")
def test_get_cafe_detail_google_api_failure(mock_get):
    mock_get.return_value.status_code = 500

    client = APIClient()
    response = client.get("/api/cafe-detail/?place_id=mock_place_id")

    assert response.status_code == 500
    assert response.json() == {"error": "Failed to fetch cafe details"}



@pytest.mark.django_db
def test_guest_login_success():
    client = APIClient()

    response = client.post("/api/guest-login/")

    assert response.status_code == 200
    data = response.json()
    assert "name" in data
    assert data["name"].startswith("guest_")


@pytest.mark.django_db
@patch("cafemap.views.User.objects.create")
def test_guest_login_failure(mock_create):
    mock_create.side_effect = Exception("DB error")

    client = APIClient()
    response = client.post("/api/guest-login/")

    assert response.status_code == 500
    data = response.json()
    assert data["error"] == "Internal Server Error"
    assert "message" in data


# ---------- MapAPIView GET(認証あり) テスト ----------
@pytest.mark.django_db
def test_map_api_get_authenticated_user():
    # Arrange
    user = User.objects.create_user(name="testuser", password="password123")
    map1 = Map.objects.create(name="Test Map 1")
    map2 = Map.objects.create(name="Test Map 2")
    MapUserRelation.objects.create(user=user, map=map1)
    MapUserRelation.objects.create(user=user, map=map2)

    client = APIClient()
    client.force_authenticate(user=user)

    # Act
    response = client.get("/api/maps/")

    # Assert
    assert response.status_code == 200
    assert len(response.data) == 2
    names = [m["name"] for m in response.data]
    assert "Test Map 1" in names
    assert "Test Map 2" in names

# ---------- MapAPIView POST(認証あり) テスト ----------
@pytest.mark.django_db
def test_map_api_post_create_map():
    # Arrange
    user = User.objects.create_user(name="testuser2", password="password456")
    client = APIClient()
    client.force_authenticate(user=user)

    # Act
    response = client.post("/api/maps/", {"name": "New Test Map"}, format="json")

    # Assert
    assert response.status_code == 201
    assert response.data["name"] == "New Test Map"

# ---------- MapAPIView GET(未認証) テスト ----------
@pytest.mark.django_db
def test_map_api_get_unauthenticated_user():
    client = APIClient()
    response = client.get("/api/maps/")

    assert response.status_code == 403
    assert "detail" in response.data



# ---------- MapDetailAPIView テスト ----------

@pytest.mark.django_db
def test_map_detail_get_success():
    user = User.objects.create_user(name="testuser", password="password123")
    client = APIClient()
    client.force_authenticate(user=user)

    map_obj = Map.objects.create(name="Test Map")
    MapUserRelation.objects.create(user=user, map=map_obj)

    cafe = Cafe.objects.create(
        place_id="test_place_id",
        name="Test Cafe",
        latitude=35.0,
        longitude=139.0,
    )
    CafeMapRelation.objects.create(map=map_obj, cafe=cafe)

    response = client.get(f"/api/maps/{map_obj.id}/")

    assert response.status_code == 200
    data = response.json()
    assert data["id"] == map_obj.id
    assert data["name"] == "Test Map"
    assert isinstance(data["cafes"], list)
    assert data["cafes"][0]["name"] == "Test Cafe"

@pytest.mark.django_db
def test_map_detail_get_not_found():
    client = APIClient()
    user = User.objects.create_user(name="testuser_get_notfound", password="password123")
    client.force_authenticate(user=user)
    
    response = client.get("/api/maps/9999/")

    assert response.status_code == 404
    assert response.json() == {"error": "Map not found"}


@pytest.mark.django_db
def test_map_detail_delete_success():
    user = User.objects.create_user(name="testuser_delete", password="password123")
    client = APIClient()
    client.force_authenticate(user=user)

    map_obj = Map.objects.create(name="Test Map to Delete")
    MapUserRelation.objects.create(user=user, map=map_obj)

    response = client.delete(f"/api/maps/{map_obj.id}/")

    assert response.status_code == 204


@pytest.mark.django_db
def test_map_detail_delete_not_found():
    client = APIClient()
    user = User.objects.create_user(name="testuser_delete_notfound", password="password123")
    client.force_authenticate(user=user)

    response = client.delete("/api/maps/9999/")

    assert response.status_code == 404
    assert response.json() == {"error": "Map not found"}



@pytest.mark.django_db
def test_cafe_api_get_success():
    user = User.objects.create_user(name="testuser_cafe_get", password="password123")
    client = APIClient()
    client.force_authenticate(user=user)

    map_obj = Map.objects.create(name="Test Map for Cafes")
    MapUserRelation.objects.create(user=user, map=map_obj)

    cafe = Cafe.objects.create(
        place_id="test_place_id_1",
        name="Test Cafe 1",
        latitude=35.0,
        longitude=139.0,
    )
    CafeMapRelation.objects.create(map=map_obj, cafe=cafe)

    response = client.get(f"/api/maps/{map_obj.id}/cafes/")

    assert response.status_code == 200
    cafes = response.json()
    assert len(cafes) == 1
    assert cafes[0]["name"] == "Test Cafe 1"



@pytest.mark.django_db
def test_cafe_api_post_success():
    user = User.objects.create_user(name="testuser_cafe_post", password="password123")
    client = APIClient()
    client.force_authenticate(user=user)

    map_obj = Map.objects.create(name="Test Map for Cafe Post")
    MapUserRelation.objects.create(user=user, map=map_obj)

    post_data = {
        "place_id": "test_place_id_2",
        "name": "Test Cafe 2",
        "address": "Test Address",
        "latitude": 35.1,
        "longitude": 139.1,
        "rating": 4.5,
        "user_ratings_total": 10,
        "photo_reference": "mock_photo_ref",
        "photo_url": "https://example.com/photo.jpg",
        "photos": ["https://example.com/photo1.jpg", "https://example.com/photo2.jpg"],
        "phone_number": "000-1111-2222",
        "opening_hours": ["月曜日: 10:00～18:00"],
    }

    response = client.post(f"/api/maps/{map_obj.id}/cafes/", post_data, format="json")

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Cafe 2"



@pytest.mark.django_db
def test_cafe_detail_api_get_success():
    user = User.objects.create_user(name="testuser_cafe_detail_get", password="password123")
    client = APIClient()
    client.force_authenticate(user=user)

    map_obj = Map.objects.create(name="Test Map for Cafe Detail")
    MapUserRelation.objects.create(user=user, map=map_obj)

    cafe = Cafe.objects.create(
        place_id="test_place_id_3",
        name="Test Cafe 3",
        latitude=35.2,
        longitude=139.2,
    )
    CafeMapRelation.objects.create(map=map_obj, cafe=cafe)

    response = client.get(f"/api/maps/{map_obj.id}/cafes/{cafe.id}/")

    assert response.status_code == 200
    assert response.json() == {"message": "GET request received"}


@pytest.mark.django_db
def test_cafe_detail_api_put_success():
    user = User.objects.create_user(name="testuser_cafe_detail_put", password="password123")
    client = APIClient()
    client.force_authenticate(user=user)

    map_obj = Map.objects.create(name="Test Map for Cafe Detail PUT")
    MapUserRelation.objects.create(user=user, map=map_obj)

    cafe = Cafe.objects.create(
        place_id="test_place_id_4",
        name="Test Cafe 4",
        latitude=35.3,
        longitude=139.3,
    )
    CafeMapRelation.objects.create(map=map_obj, cafe=cafe)

    response = client.put(f"/api/maps/{map_obj.id}/cafes/{cafe.id}/", {}, format="json")

    assert response.status_code == 200
    assert response.json() == {"message": "PUT request received"}



@pytest.mark.django_db
def test_cafe_detail_api_delete_success():
    user = User.objects.create_user(name="testuser_cafe_detail_delete", password="password123")
    client = APIClient()
    client.force_authenticate(user=user)

    map_obj = Map.objects.create(name="Test Map for Cafe Detail DELETE")
    MapUserRelation.objects.create(user=user, map=map_obj)

    cafe = Cafe.objects.create(
        place_id="test_place_id_5",
        name="Test Cafe 5",
        latitude=35.4,
        longitude=139.4,
    )
    CafeMapRelation.objects.create(map=map_obj, cafe=cafe)

    response = client.delete(f"/api/maps/{map_obj.id}/cafes/{cafe.id}/")

    assert response.status_code == 204
