# load_dummy_data.py
import os
import sys
import django

sys.path.append('/app')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')  # あなたのプロジェクト名に合わせて
django.setup()

from cafemap.models import User, Map, MapUserRelation, Cafe, CafeMapRelation  # モデルをインポート
from dummy_data import mock_users, mock_maps, mock_cafes  # 作ったダミーデータをインポート

def load_users():
    for user_data in mock_users:
        email = f"{user_data['name'].replace(' ', '_').lower()}@example.com"  # ユニークなメールを自動生成
        user, created = User.objects.get_or_create(
            name=user_data["name"],
            defaults={"email": email}
        )
        if created:
            if user.name == "admin":
                # adminユーザーだけ、パスワードと権限を設定する
                user.set_password("admin123")
                user.is_staff = True
                user.is_superuser = True
                user.is_active = True
                print(f"Created admin user: {user.name}")
            else:
                # その他のユーザー（ゲスト・テストユーザーなど）はログインできないパスワードにする
                user.set_unusable_password()
                print(f"Created normal user: {user.name}")
            user.save()


def load_maps():
    for map_data in mock_maps:
        user = User.objects.get(id=map_data["user_id"])
        map_obj, created = Map.objects.get_or_create(
            name=map_data["name"]  # ← idを指定しない！

        )
        if created:
            print(f"Created map: {map_obj.name}")
        MapUserRelation.objects.get_or_create(user=user, map=map_obj)

def load_cafes():
    # カフェとマップの対応を決めるルール
    map_assignments = {
        1: [0, 1],  # 渋谷カフェマップ → スタバ・コトカフェ
        2: [2],     # 東京駅カフェマップ → イノダコーヒ
        3: [3, 4],  # 京都カフェ巡り → タリーズ・コメダ
        4: [5],     # 大阪カフェ巡り → サンマルク
        # 必要に応じて追加
    }

    for map_id, cafe_indexes in map_assignments.items():
        try:
            target_map = Map.objects.get(id=map_id)
        except Map.DoesNotExist:
            print(f"対象のマップ（id={map_id}）が存在しません")
            continue

        for idx in cafe_indexes:
            cafe_data = mock_cafes[idx]
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
                    "website": cafe_data["website"], 
                    "price_level": cafe_data["price_level"],
                }
            )
            if created:
                print(f"Created cafe: {cafe.name}")

            relation, relation_created = CafeMapRelation.objects.get_or_create(
                map=target_map,
                cafe=cafe
            )
            if relation_created:
                print(f"Linked {cafe.name} to map: {target_map.name}")


def main():
    load_users()
    load_maps()
    load_cafes()

if __name__ == "__main__":
    main()
