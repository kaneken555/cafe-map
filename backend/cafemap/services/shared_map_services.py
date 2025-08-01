# services/shared_map_services.py
from django.shortcuts import get_object_or_404
from cafemap.models import SharedMap, Map, MapUserRelation, Cafe, CafeMapRelation, CafeSharedMapRelation, UserSharedMapRelation
from uuid import UUID


def get_shared_map_info(map_id, user):
    """指定マップがシェア済みかどうかをチェック"""
    shared_map = SharedMap.objects.filter(
        original_map__id=map_id,
        creator=user
    ).first()

    if shared_map:
        return {
            "shared": True,
            "share_uuid": str(shared_map.share_uuid),
            "title": shared_map.title
        }
    else:
        return {
            "shared": False
        }

def create_or_get_shared_map(map_id, user, title=None, description=""):
    """シェアマップを作成（既に存在すればそれを返す）"""
    original_map = get_object_or_404(Map, id=map_id)

    # 既に存在するなら再利用
    existing = SharedMap.objects.filter(original_map=original_map, creator=user).first()
    if existing:
        return {
            "share_uuid": str(existing.share_uuid),
            "title": existing.title,
            "created": False
        }

    # 新規作成
    shared_map = SharedMap.objects.create(
        original_map=original_map,
        creator=user,
        title=title or original_map.name,
        description=description
    )

    # 関連カフェをコピー
    cafes = Cafe.objects.filter(cafemaprelation__map=original_map).distinct()
    for cafe in cafes:
        CafeSharedMapRelation.objects.create(shared_map=shared_map, cafe=cafe)

    return {
        "share_uuid": str(shared_map.share_uuid),
        "title": shared_map.title,
        "created": True
    }

def get_shared_maps_for_user(user):
    """ユーザーが登録しているシェアマップの一覧を取得"""
    maps = SharedMap.objects.filter(usersharedmaprelation__user=user).distinct()
    return [
        {"id": m.id, "name": m.title, "uuid": m.share_uuid}
        for m in maps
    ]

def get_shared_map_detail(uuid: UUID):
    """シェアマップ詳細（カフェ情報付き）を取得"""
    shared_map = SharedMap.objects.get(share_uuid=uuid)
    cafes = Cafe.objects.filter(cafesharedmaprelation__shared_map=shared_map)

    return {
        "id": shared_map.id,
        "name": shared_map.title,
        "cafes": [
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
            for cafe in cafes
        ]
    }

def register_shared_map_for_user(user, shared_map_uuid: UUID):
    """
    ユーザーに対してシェアマップを登録（すでにあれば再利用）
    """
    shared_map = get_object_or_404(SharedMap, share_uuid=shared_map_uuid)

    relation, created = UserSharedMapRelation.objects.get_or_create(
        user=user,
        shared_map=shared_map
    )

    return {
        "created": created,
        "message": "シェアマップをマイマップとして登録しました" if created else "すでに登録済みのシェアマップです"
    }

def copy_shared_map_to_user(user, shared_map_uuid: UUID, new_name: str = None):
    """
    SharedMapをもとに、ユーザーのマップを作成・関連付け・カフェもコピー
    """
    shared_map = get_object_or_404(SharedMap, share_uuid=shared_map_uuid)
    map_name = new_name or shared_map.title or "シェアマップのコピー"

    # 新しいマップ作成
    new_map = Map.objects.create(name=map_name)

    # ユーザーとマップの関連付け
    MapUserRelation.objects.create(user=user, map=new_map)

    # 関連カフェをコピー
    cafes = Cafe.objects.filter(cafesharedmaprelation__shared_map=shared_map)
    for cafe in cafes:
        CafeMapRelation.objects.create(map=new_map, cafe=cafe)

    return {
        "id": new_map.id,
        "name": new_map.name
    }