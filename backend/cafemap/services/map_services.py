# services/map_services.py
from cafemap.models import Map, MapUserRelation, GroupMapRelation
from cafemap.services.cafe_services import get_cafes_for_map


def get_maps_for_user(user):
    return Map.objects.filter(mapuserrelation__user=user)

def create_map_for_user(user, map_name):
    new_map = Map.objects.create(name=map_name)
    MapUserRelation.objects.create(user=user, map=new_map)
    return new_map

def get_map_with_cafes(map_id: int):
    map_obj = Map.objects.get(id=map_id)
    cafes = get_cafes_for_map(map_obj)

    return {
        "id": map_obj.id,
        "name": map_obj.name,
        "cafes": cafes
    }

def delete_map_with_relations(map_id: int):
    map_obj = Map.objects.get(id=map_id)
    MapUserRelation.objects.filter(map=map_obj).delete()
    map_obj.delete()

def get_maps_for_group(group):
    """グループに紐づくマップ一覧を取得"""
    maps = Map.objects.filter(groupmaprelation__group=group)
    return [{"id": m.id, "name": m.name} for m in maps]

def create_map_for_group(group, name):
    """グループに紐づくマップを新規作成"""
    map_obj = Map.objects.create(name=name)
    GroupMapRelation.objects.create(group=group, map=map_obj)
    return {"id": map_obj.id, "name": map_obj.name}
