# services/group_services.py
from cafemap.models import Group, UserGroupRelation
from django.shortcuts import get_object_or_404


def get_groups_for_user(user):
    """ユーザーが所属するグループ一覧を取得"""
    groups = Group.objects.filter(usergrouprelation__user=user)
    return [
        {
            "id": g.id,
            "uuid": str(g.uuid),
            "name": g.name,
            "description": g.description
        }
        for g in groups
    ]

def create_group_with_user(user, name: str, description: str = ""):
    """グループを作成し、ユーザーを所属させる"""
    group = Group.objects.create(name=name, description=description)
    UserGroupRelation.objects.create(user=user, group=group)
    return {
        "id": group.id,
        "name": group.name
    }

def join_group_by_uuid(user, group_uuid):
    """ユーザーをUUID指定のグループに参加させる"""
    group = get_object_or_404(Group, uuid=group_uuid)
    UserGroupRelation.objects.get_or_create(user=user, group=group)
    return group

def user_in_group(user, group):
    """ユーザーがグループに所属しているか確認"""
    return UserGroupRelation.objects.filter(user=user, group=group).exists()

def delete_group_and_relations(group):
    """指定されたグループと関連情報を削除する"""
    group.delete()
