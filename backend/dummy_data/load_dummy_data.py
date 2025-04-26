# load_dummy_data.py
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')  # あなたのプロジェクト名に合わせて
django.setup()

from cafemap.models import User, Map, MapUserRelation, Cafe, CafeMapRelation  # モデルをインポート
from dummy_data import mock_users, mock_maps, mock_cafes  # 作ったダミーデータをインポート

def load_users():
    for user_data in mock_users:
        user, created = User.objects.get_or_create(
            id=user_data["id"],
            defaults={"name": user_data["name"], "password": None}
        )
        if created:
            print(f"Created user: {user.name}")

def load_maps():
    for map_data in mock_maps:
        user = User.objects.get(id=map_data["user_id"])
        map_obj, created = Map.objects.get_or_create(
            id=map_data["id"],
            defaults={"name": map_data["name"]}
        )
        if created:
            print(f"Created map: {map_obj.name}")
        MapUserRelation.objects.get_or_create(user=user, map=map_obj)

def load_cafes():
    for idx, cafe_data in enumerate(mock_cafes, start=1):
        cafe, created = Cafe.objects.get_or_create(
            place_id=cafe_data["place_id"],
            defaults={
                "name": cafe_data["name"],
                "address": cafe_data["address"],
                "latitude": cafe_data["latitude"],
                "longitude": cafe_data["longitude"],
                "rating": cafe_data["rating"],
                "photo_urls": cafe_data["photo_urls"],
                "phone_number": cafe_data["phone_number"],
                "opening_hours": cafe_data["opening_hours"],
            }
        )
        if created:
            print(f"Created cafe: {cafe.name}")

def main():
    load_users()
    load_maps()
    load_cafes()

if __name__ == "__main__":
    main()
