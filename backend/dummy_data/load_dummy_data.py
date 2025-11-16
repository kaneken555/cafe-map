# load_dummy_data.py
import os
import sys
import django
from django.db import transaction

sys.path.append('/app')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from cafemap.models import (
    User, Map, MapUserRelation, Cafe, CafeMapRelation,
    Group, UserGroupRelation, GroupMapRelation,
    SharedMap, CafeSharedMapRelation, UserSharedMapRelation
)
from dummy_data import (
    mock_users, mock_maps, mock_cafes,
    mock_groups, mock_user_group_relations, mock_group_map_relations,
    mock_shared_maps
)

# ---------------------------------------
# Utils
# ---------------------------------------
def get_user_by_any(name=None, id_=None):
    if id_ is not None:
        try:
            return User.objects.get(id=id_)
        except User.DoesNotExist:
            pass
    if name:
        return User.objects.get(name=name)
    raise User.DoesNotExist("User not found")

def get_map_by_any(name=None, id_=None):
    if id_ is not None:
        try:
            return Map.objects.get(id=id_)
        except Map.DoesNotExist:
            pass
    if name:
        return Map.objects.get(name=name)
    raise Map.DoesNotExist("Map not found")

def get_group_by_any(name=None, id_=None):
    if id_ is not None:
        try:
            return Group.objects.get(id=id_)
        except Group.DoesNotExist:
            pass
    if name:
        return Group.objects.get(name=name)
    raise Group.DoesNotExist("Group not found")

# ---------------------------------------
# Loaders
# ---------------------------------------
@transaction.atomic
def load_users():
    for user_data in mock_users:
        # 既存に依存せず一意メール生成
        email = f"{user_data['name'].replace(' ', '_').lower()}@example.com"
        user, created = User.objects.get_or_create(
            name=user_data["name"],
            defaults={"email": email}
        )
        if created:
            if user.name == "admin":
                user.set_password("admin123")
                user.is_staff = True
                user.is_superuser = True
                user.is_active = True
                print(f"[User] Created admin: {user.name}")
            else:
                user.set_unusable_password()
                print(f"[User] Created normal: {user.name}")
            user.save()

@transaction.atomic
def load_maps():
    """
    mock_maps は以下のどちらでもOK:
    - {"name": ..., "user_id": 1}
    - {"name": ..., "user_name": "guest"}
    """
    for map_data in mock_maps:
        user = None
        if "user_name" in map_data:
            user = get_user_by_any(name=map_data["user_name"])
        else:
            user = get_user_by_any(id_=map_data.get("user_id"))

        map_obj, created = Map.objects.get_or_create(
            name=map_data["name"],
            defaults={"description": map_data.get("description", "")}
        )
        if created:
            print(f"[Map] Created: {map_obj.name}")

        MapUserRelation.objects.get_or_create(user=user, map=map_obj)

@transaction.atomic
def load_groups():
    """
    mock_groups は {"name": ..., "description": "..."} 形式
    """
    for g in mock_groups:
        group, created = Group.objects.get_or_create(
            name=g["name"],
            defaults={"description": g.get("description", "")}
        )
        if created:
            print(f"[Group] Created: {group.name}")

@transaction.atomic
def load_user_group_relations():
    """
    mock_user_group_relations は以下のどちらでもOK:
    - {"user_name": "guest", "group_name": "渋谷カフェ部"}
    - {"user_id": 1, "group_id": 2}
    """
    for rel in mock_user_group_relations:
        user = get_user_by_any(
            name=rel.get("user_name"),
            id_=rel.get("user_id"),
        )
        group = get_group_by_any(
            name=rel.get("group_name"),
            id_=rel.get("group_id"),
        )
        _, created = UserGroupRelation.objects.get_or_create(user=user, group=group)
        if created:
            print(f"[UserGroup] {user.name} -> {group.name}")

@transaction.atomic
def load_group_map_relations():
    """
    mock_group_map_relations は以下のどちらでもOK:
    - {"group_name": "渋谷カフェ部", "map_name": "渋谷カフェマップ"}
    - {"group_id": 1, "map_id": 3}
    """
    for rel in mock_group_map_relations:
        group = get_group_by_any(
            name=rel.get("group_name"),
            id_=rel.get("group_id"),
        )
        map_obj = get_map_by_any(
            name=rel.get("map_name"),
            id_=rel.get("map_id"),
        )
        _, created = GroupMapRelation.objects.get_or_create(group=group, map=map_obj)
        if created:
            print(f"[GroupMap] {group.name} -> {map_obj.name}")

@transaction.atomic
def load_cafes_and_link_to_maps():
    """
    Cafe を作成し、指定の Map に紐付ける。
    dummy_data 側の mock_cafes は配列のまま（既存のままでOK）。
    どの Map にどの index の Cafe を貼るかは、この関数内で決める。
    → Map名ベースで安全に割当
    """
    # ここで「どのマップに、mock_cafes の何番を貼るか」を宣言的に指定
    assignments_by_map_name = {
        "渋谷カフェマップ": [0, 1],  # スタバ・コトカフェ
        "東京駅カフェマップ": [2],   # イノダコーヒ
        "京都カフェ巡り":     [3, 4], # タリーズ・コメダ
        "大阪カフェ巡り":     [5],    # サンマルク
        # 必要に応じて追加
    }

    for map_name, cafe_indexes in assignments_by_map_name.items():
        try:
            target_map = get_map_by_any(name=map_name)
        except Map.DoesNotExist:
            print(f"[WARN] 対象のマップ（name={map_name}）が存在しません")
            continue

        for idx in cafe_indexes:
            if idx >= len(mock_cafes):
                print(f"[WARN] mock_cafes[{idx}] は存在しません")
                continue

            cafe_data = mock_cafes[idx]
            cafe, created = Cafe.objects.get_or_create(
                place_id=cafe_data["place_id"],
                defaults={
                    "name": cafe_data["name"],
                    "address": cafe_data["address"],
                    "latitude": cafe_data["latitude"],
                    "longitude": cafe_data["longitude"],
                    "rating": cafe_data.get("rating"),
                    "photo_urls": cafe_data.get("photo_urls", []),
                    "phone_number": cafe_data.get("phone_number"),
                    "opening_hours": cafe_data.get("opening_hours"),
                    "website": cafe_data.get("website"),
                    "price_level": cafe_data.get("price_level"),
                }
            )
            if created:
                print(f"[Cafe] Created: {cafe.name}")

            _, rel_created = CafeMapRelation.objects.get_or_create(map=target_map, cafe=cafe)
            if rel_created:
                print(f"[CafeMap] Linked {cafe.name} -> {target_map.name}")

@transaction.atomic
def load_shared_maps_and_relations():
    """
    mock_shared_maps 形式の例:
    {
        "original_map_name": "渋谷カフェマップ",  # or original_map_id
        "creator_name": "guest",                 # or creator_id
        "title": "...", "description": "...",
        "allow_sync": False,
        "participants": ["test", "admin"],       # or [user_ids...]
        "copy_cafes_from_original": True
    }
    """
    for sm in mock_shared_maps:
        original_map = get_map_by_any(
            name=sm.get("original_map_name"),
            id_=sm.get("original_map_id"),
        )
        creator = get_user_by_any(
            name=sm.get("creator_name"),
            id_=sm.get("creator_id"),
        )
        shared_map, created = SharedMap.objects.get_or_create(
            original_map=original_map,
            creator=creator,
            title=sm.get("title"),
            defaults={
                "description": sm.get("description", ""),
                "allow_sync": sm.get("allow_sync", False),
                "is_active": True,
            }
        )
        if created:
            print(f"[SharedMap] Created: {shared_map.title or str(shared_map.share_uuid)}")

        # 共有者（creator）を参加者として登録
        UserSharedMapRelation.objects.get_or_create(user=creator, shared_map=shared_map)

        # 追加参加者
        for p_name in sm.get("participants", []):
            participant = get_user_by_any(name=p_name) if isinstance(p_name, str) else get_user_by_any(id_=p_name)
            UserSharedMapRelation.objects.get_or_create(user=participant, shared_map=shared_map)
            print(f"[UserSharedMap] {participant.name} joined {shared_map.title or shared_map.share_uuid}")

        # 元マップのカフェをコピーして SharedMap にも関連付け
        if sm.get("copy_cafes_from_original", True):
            cafes = Cafe.objects.filter(cafemaprelation__map=original_map).distinct()
            linked = 0
            for cafe in cafes:
                _, rel_created = CafeSharedMapRelation.objects.get_or_create(shared_map=shared_map, cafe=cafe)
                if rel_created:
                    linked += 1
            if linked:
                print(f"[CafeSharedMap] Copied {linked} cafes -> {shared_map.title or shared_map.share_uuid}")

# ---------------------------------------
# main
# ---------------------------------------
def main():
    load_users()
    load_maps()
    load_groups()
    load_user_group_relations()
    load_group_map_relations()
    load_cafes_and_link_to_maps()
    load_shared_maps_and_relations()
    print("✅ Dummy data loading completed.")

if __name__ == "__main__":
    main()
