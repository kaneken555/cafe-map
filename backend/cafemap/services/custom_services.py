"""カスタマイズ設定のサービス層"""
from django.db import transaction
from django.db.models import Q
from cafemap.models import Custom, Map
from cafemap.utils.custom_utils import get_default_custom_id


class CustomService:
    """カスタマイズ設定のビジネスロジック"""

    @staticmethod
    def get_user_customs(user):
        """
        ユーザーが選択可能なCustom一覧を取得

        Args:
            user: ユーザーオブジェクト

        Returns:
            QuerySet: Custom一覧（プリセット + 自分が作成したCustom）
        """
        return Custom.objects.filter(
            Q(is_public=True) |  # プリセットCustom
            Q(created_by_user=user, is_snapshot=False)  # 自分が作成したCustom（スナップショット除く）
        ).exclude(is_snapshot=True).order_by('-is_public', 'created_at')

    @staticmethod
    def get_custom_by_id(custom_id, user=None):
        """
        Custom IDからCustomを取得

        Args:
            custom_id: Custom ID
            user: ユーザーオブジェクト（権限チェック用、任意）

        Returns:
            Custom: Customオブジェクト、存在しないか権限がない場合はNone
        """
        try:
            custom = Custom.objects.get(pk=custom_id)

            # 権限チェック（userが指定されている場合）
            if user:
                # プリセットCustomまたは自分が作成したCustomのみアクセス可能
                if not custom.is_public and custom.created_by_user != user:
                    return None

            return custom
        except Custom.DoesNotExist:
            return None

    @staticmethod
    def create_custom(user, data):
        """
        Custom新規作成

        Args:
            user: 作成者
            data: Customデータ（dict）

        Returns:
            Custom: 作成されたCustomオブジェクト
        """
        custom = Custom.objects.create(
            name=data['name'],
            description=data.get('description', ''),
            map_style=data['map_style'],
            icon_variant=data['icon_variant'],
            icon_color=data['icon_color'],
            icon_size=data['icon_size'],
            show_labels=data['show_labels'],
            border_color=data.get('border_color'),
            background_color=data.get('background_color'),
            created_by_user=user,
            is_public=False,
            is_snapshot=False
        )
        return custom

    @staticmethod
    def update_custom(custom, data):
        """
        Custom更新

        Args:
            custom: 更新対象のCustomオブジェクト
            data: 更新データ（dict）

        Returns:
            Custom: 更新後のCustomオブジェクト
        """
        # 更新可能なフィールドのみ更新
        updatable_fields = [
            'name', 'description', 'map_style', 'icon_variant',
            'icon_color', 'icon_size', 'show_labels',
            'border_color', 'background_color'
        ]

        for field in updatable_fields:
            if field in data:
                setattr(custom, field, data[field])

        custom.save()
        return custom

    @staticmethod
    @transaction.atomic
    def delete_custom(custom):
        """
        Custom削除（使用中のMapはデフォルトCustomに変更）

        Args:
            custom: 削除対象のCustomオブジェクト

        Returns:
            int: デフォルトCustomに変更されたMap件数
        """
        default_id = get_default_custom_id()

        # 使用中のMapをデフォルトCustomに変更
        updated_count = Map.objects.filter(custom=custom).update(custom_id=default_id)

        # Custom削除
        custom.delete()

        return updated_count

    @staticmethod
    def create_snapshot_custom(source_custom):
        """
        スナップショットCustomを作成

        Args:
            source_custom: コピー元のCustomオブジェクト

        Returns:
            Custom: 作成されたスナップショットCustom
        """
        snapshot = Custom.objects.create(
            name=f"{source_custom.name}（スナップショット）",
            description=source_custom.description,
            map_style=source_custom.map_style,
            icon_variant=source_custom.icon_variant,
            icon_color=source_custom.icon_color,
            icon_size=source_custom.icon_size,
            show_labels=source_custom.show_labels,
            border_color=source_custom.border_color,
            background_color=source_custom.background_color,
            is_snapshot=True,
            is_public=False,
            original_custom=source_custom,
            created_by_user=source_custom.created_by_user
        )
        return snapshot

    @staticmethod
    def can_edit_custom(custom, user):
        """
        Customを編集可能かチェック

        Args:
            custom: Customオブジェクト
            user: ユーザーオブジェクト

        Returns:
            tuple: (bool: 編集可能か, str: エラーメッセージ)
        """
        if custom.is_public:
            return False, 'プリセットのカスタマイズ設定は編集できません'

        if custom.is_snapshot:
            return False, 'スナップショットのカスタマイズ設定は編集できません'

        if custom.created_by_user != user:
            return False, 'このカスタマイズ設定を編集する権限がありません'

        return True, None

    @staticmethod
    def can_delete_custom(custom, user):
        """
        Customを削除可能かチェック

        Args:
            custom: Customオブジェクト
            user: ユーザーオブジェクト

        Returns:
            tuple: (bool: 削除可能か, str: エラーメッセージ)
        """
        if custom.is_public:
            return False, 'プリセットのカスタマイズ設定は削除できません'

        if custom.is_snapshot:
            return False, 'スナップショットのカスタマイズ設定は削除できません'

        if custom.created_by_user != user:
            return False, 'このカスタマイズ設定を削除する権限がありません'

        return True, None
