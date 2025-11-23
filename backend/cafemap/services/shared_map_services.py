# services/shared_map_services.py
from django.shortcuts import get_object_or_404
from django.utils import timezone
from cafemap.models import (
    SharedMap, Map, MapUserRelation, Cafe, CafeMapRelation,
    CafeSharedMapRelation, UserSharedMapRelation, ShareChannel,
    SharedMapAnalyzeLink, Custom
)
from cafemap.services.custom_services import CustomService
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
    """
    シェアマップを作成（既に存在すればそれを返す）

    SharedMap作成時に元のMapのCustomからスナップショットCustomを自動作成し、
    SharedMapに紐付ける。これにより元のCustomが編集・削除されても
    SharedMapの見た目は変わらない。
    """
    original_map = get_object_or_404(Map, id=map_id)

    # 既に存在するなら再利用
    existing = SharedMap.objects.filter(original_map=original_map, creator=user).first()
    if existing:
        return {
            "share_uuid": str(existing.share_uuid),
            "title": existing.title,
            "created": False
        }

    # 元のMapのCustomからスナップショットCustomを作成
    snapshot_custom = None
    if original_map.custom:
        snapshot_custom = CustomService.create_snapshot_custom(original_map.custom)

    # SharedMap新規作成
    shared_map = SharedMap.objects.create(
        original_map=original_map,
        creator=user,
        title=title or original_map.name,
        description=description,
        custom=snapshot_custom  # スナップショットCustomを紐付け
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

    # Custom情報を取得
    custom_data = None
    if shared_map.custom:
        custom_data = {
            "id": shared_map.custom.id,
            "name": shared_map.custom.name,
            "map_style": shared_map.custom.map_style,
            "icon_variant": shared_map.custom.icon_variant,
            "icon_color": shared_map.custom.icon_color,
            "icon_size": shared_map.custom.icon_size,
            "show_labels": shared_map.custom.show_labels,
            "border_color": shared_map.custom.border_color,
            "background_color": shared_map.custom.background_color,
        }

    return {
        "id": shared_map.id,
        "name": shared_map.title,
        "custom": custom_data,
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

    SharedMapのスナップショットCustomから新しいユーザーCustomを作成し、
    コピーされたMapに紐付ける。
    """
    shared_map = get_object_or_404(SharedMap, share_uuid=shared_map_uuid)
    map_name = new_name or shared_map.title or "シェアマップのコピー"

    # SharedMapのスナップショットCustomから新しいユーザーCustomを作成
    custom_id = None
    if shared_map.custom:
        # スナップショットCustomをベースに新しいユーザーCustomを作成
        new_custom = Custom.objects.create(
            name=f"{shared_map.custom.name}（コピー）",
            description=shared_map.custom.description,
            map_style=shared_map.custom.map_style,
            icon_variant=shared_map.custom.icon_variant,
            icon_color=shared_map.custom.icon_color,
            icon_size=shared_map.custom.icon_size,
            show_labels=shared_map.custom.show_labels,
            border_color=shared_map.custom.border_color,
            background_color=shared_map.custom.background_color,
            created_by_user=user,
            is_public=False,
            is_snapshot=False
        )
        custom_id = new_custom.id

    # 新しいマップ作成
    new_map = Map.objects.create(name=map_name, custom_id=custom_id)

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


# ========== アナライズ機能関連 ==========

def get_all_share_channels():
    """有効な共有先マスタを全て取得"""
    channels = ShareChannel.objects.filter(is_active=True).order_by('sort_order')
    return [
        {
            "id": ch.id,
            "key": ch.key,
            "name": ch.name,
            "description": ch.description,
            "icon": ch.icon,
            "sort_order": ch.sort_order,
        }
        for ch in channels
    ]


def get_analyze_data_for_map(map_id, user):
    """指定マップのアナライズ情報を取得"""
    # マップの所有権チェック
    original_map = get_object_or_404(Map, id=map_id)

    # ユーザーがこのマップの所有者か確認
    if not MapUserRelation.objects.filter(user=user, map=original_map).exists():
        raise PermissionError("このマップへのアクセス権がありません")

    # 対応するSharedMapを取得
    shared_map = SharedMap.objects.filter(
        original_map=original_map,
        creator=user
    ).first()

    if not shared_map:
        # SharedMapがまだ作成されていない場合
        return {
            "shared_map_id": None,
            "shared_map_name": None,
            "share_uuid": None,
            "direct_access_count": 0,
            "direct_last_accessed_at": None,
            "analyze_links": []
        }

    # AnalyzeLinkを取得
    analyze_links = SharedMapAnalyzeLink.objects.filter(
        shared_map=shared_map,
        is_active=True
    ).select_related('channel').order_by('channel__sort_order')

    return {
        "shared_map_id": shared_map.id,
        "shared_map_name": shared_map.title,
        "share_uuid": str(shared_map.share_uuid),
        "direct_access_count": shared_map.direct_access_count,
        "direct_last_accessed_at": shared_map.direct_last_accessed_at.isoformat() if shared_map.direct_last_accessed_at else None,
        "analyze_links": [
            {
                "id": link.id,
                "channel_key": link.channel.key,
                "channel_name": link.channel.name,
                "custom_label": link.custom_label,
                "share_link_url": link.share_link_url,
                "access_count": link.access_count,
                "last_accessed_at": link.last_accessed_at.isoformat() if link.last_accessed_at else None,
                "created_at": link.created_at.isoformat(),
            }
            for link in analyze_links
        ]
    }


def create_or_get_analyze_link(map_id, user, channel_key, custom_label=None):
    """シェアリンクを作成または取得（既存があれば再利用）"""
    # マップの所有権チェック
    original_map = get_object_or_404(Map, id=map_id)

    if not MapUserRelation.objects.filter(user=user, map=original_map).exists():
        raise PermissionError("このマップへのアクセス権がありません")

    # チャンネルを取得
    channel = get_object_or_404(ShareChannel, key=channel_key, is_active=True)

    # SharedMapを取得または作成
    shared_map = SharedMap.objects.filter(
        original_map=original_map,
        creator=user
    ).first()

    if not shared_map:
        # SharedMapが存在しない場合は作成
        shared_map = SharedMap.objects.create(
            original_map=original_map,
            creator=user,
            title=original_map.name,
        )
        # 関連カフェをコピー
        cafes = Cafe.objects.filter(cafemaprelation__map=original_map).distinct()
        for cafe in cafes:
            CafeSharedMapRelation.objects.create(shared_map=shared_map, cafe=cafe)

    # AnalyzeLinkを取得または作成
    share_link_url = f"/shared-maps/{shared_map.share_uuid}?src={channel_key}"

    analyze_link, created = SharedMapAnalyzeLink.objects.get_or_create(
        shared_map=shared_map,
        channel=channel,
        defaults={
            "share_link_url": share_link_url,
            "custom_label": custom_label or "",
        }
    )

    # 既存の場合でcustom_labelが指定されていれば更新
    if not created and custom_label is not None:
        analyze_link.custom_label = custom_label
        analyze_link.save(update_fields=['custom_label'])

    return {
        "id": analyze_link.id,
        "channel_key": channel.key,
        "channel_name": channel.name,
        "custom_label": analyze_link.custom_label,
        "share_link_url": analyze_link.share_link_url,
        "access_count": analyze_link.access_count,
        "last_accessed_at": analyze_link.last_accessed_at.isoformat() if analyze_link.last_accessed_at else None,
        "created_at": analyze_link.created_at.isoformat(),
        "created": created,
    }


def update_analyze_link_label(link_id, user, custom_label):
    """AnalyzeLinkのcustom_labelを更新"""
    analyze_link = get_object_or_404(SharedMapAnalyzeLink, id=link_id)

    # 権限チェック（creatorが一致するか）
    if analyze_link.shared_map.creator != user:
        raise PermissionError("このリンクの編集権限がありません")

    analyze_link.custom_label = custom_label
    analyze_link.save(update_fields=['custom_label'])

    return {
        "id": analyze_link.id,
        "custom_label": analyze_link.custom_label,
    }


def increment_access_count(share_uuid, src_param=None):
    """SharedMapのアクセスカウントを増やす"""
    shared_map = get_object_or_404(SharedMap, share_uuid=share_uuid)

    if src_param:
        # 共有先経由のアクセス
        try:
            channel = ShareChannel.objects.get(key=src_param, is_active=True)
            analyze_link, created = SharedMapAnalyzeLink.objects.get_or_create(
                shared_map=shared_map,
                channel=channel,
                defaults={
                    'share_link_url': f'/shared-maps/{share_uuid}?src={src_param}'
                }
            )
            analyze_link.access_count += 1
            analyze_link.last_accessed_at = timezone.now()
            analyze_link.save(update_fields=['access_count', 'last_accessed_at'])
        except ShareChannel.DoesNotExist:
            pass  # 無効なsrcは無視
    else:
        # 直接アクセス
        shared_map.direct_access_count += 1
        shared_map.direct_last_accessed_at = timezone.now()
        shared_map.save(update_fields=['direct_access_count', 'direct_last_accessed_at'])