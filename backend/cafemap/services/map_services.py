# services/map_services.py
from cafemap.models import Map, MapUserRelation, GroupMapRelation, Custom
from cafemap.services.cafe_services import get_cafes_for_map
from cafemap.utils.custom_utils import get_default_custom_id


def get_maps_for_user(user):
    return Map.objects.filter(mapuserrelation__user=user)

def create_map_for_user(user, map_name, custom_id=None):
    """
    ユーザー用のマップを作成

    Args:
        user: ユーザーオブジェクト
        map_name: マップ名
        custom_id: Custom ID（指定がない場合はデフォルトCustomを使用）
    """
    if custom_id is None:
        custom_id = get_default_custom_id()

    new_map = Map.objects.create(name=map_name, custom_id=custom_id)
    MapUserRelation.objects.create(user=user, map=new_map)
    return new_map

def get_map_with_cafes(map_id: int):
    map_obj = Map.objects.get(id=map_id)
    cafes = get_cafes_for_map(map_obj)

    # Custom情報を取得
    custom_data = None
    if map_obj.custom:
        custom_data = {
            "id": map_obj.custom.id,
            "name": map_obj.custom.name,
            "map_style": map_obj.custom.map_style,
            "icon_variant": map_obj.custom.icon_variant,
            "icon_color": map_obj.custom.icon_color,
            "icon_size": map_obj.custom.icon_size,
            "show_labels": map_obj.custom.show_labels,
            "border_color": map_obj.custom.border_color,
            "background_color": map_obj.custom.background_color,
        }

    return {
        "id": map_obj.id,
        "name": map_obj.name,
        "description": map_obj.description,
        "custom": custom_data,
        "cafes": cafes,
    }

def delete_map_with_relations(map_id: int):
    map_obj = Map.objects.get(id=map_id)
    MapUserRelation.objects.filter(map=map_obj).delete()
    map_obj.delete()

def get_maps_for_group(group):
    """グループに紐づくマップ一覧を取得"""
    maps = Map.objects.filter(groupmaprelation__group=group).select_related('custom')
    result = []
    for m in maps:
        result.append({
            "id": m.id,
            "name": m.name,
            "description": m.description,
            "custom_id": m.custom.id if m.custom else None
        })
    return result

def create_map_for_group(group, name, custom_id=None):
    """
    グループに紐づくマップを新規作成

    Args:
        group: グループオブジェクト
        name: マップ名
        custom_id: Custom ID（指定がない場合はデフォルトCustomを使用）
    """
    if custom_id is None:
        custom_id = get_default_custom_id()

    map_obj = Map.objects.create(name=name, custom_id=custom_id)
    GroupMapRelation.objects.create(group=group, map=map_obj)
    return {
        "id": map_obj.id,
        "name": map_obj.name,
        "custom_id": map_obj.custom.id if map_obj.custom else None
    }

def update_map(map_obj, name: str, description: str = ""):
    """マップの情報を更新"""
    map_obj.name = name
    map_obj.description = description
    map_obj.save()
    return {
        "id": map_obj.id,
        "name": map_obj.name,
        "description": map_obj.description,
        "custom_id": map_obj.custom.id if map_obj.custom else None
    }

def update_map_info(request, map_id: int):
    """マップの名前を更新"""
    map_obj = Map.objects.get(id=map_id)
    name = request.data.get("name")
    description = request.data.get("description", "")

    if not name:
        raise ValueError("名前が未入力です")

    return update_map(map_obj, name, description)

def update_map_custom(map_obj, custom_id: int, user):
    """
    マップにCustomを適用

    Args:
        map_obj: Mapオブジェクト
        custom_id: 適用するCustom ID
        user: ユーザーオブジェクト（権限チェック用）

    Returns:
        dict: 更新後のマップ情報

    Raises:
        Custom.DoesNotExist: Customが存在しない
        PermissionError: Customへのアクセス権限がない
    """
    custom = Custom.objects.get(pk=custom_id)

    # 権限チェック: プリセットCustomまたは自分が作成したCustomのみ使用可能
    if not custom.is_public and custom.created_by_user != user:
        raise PermissionError("このカスタマイズ設定を使用する権限がありません")

    # スナップショットは使用不可
    if custom.is_snapshot:
        raise ValueError("スナップショットのカスタマイズ設定は使用できません")

    map_obj.custom = custom
    map_obj.save()

    return {
        "id": map_obj.id,
        "name": map_obj.name,
        "description": map_obj.description,
        "custom_id": map_obj.custom.id
    }
