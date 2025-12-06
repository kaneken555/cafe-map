# Generated manually

from django.db import migrations


def create_preset_customs(apps, schema_editor):
    """5つのプリセットCustomとSystemSettingを作成"""
    Custom = apps.get_model('cafemap', 'Custom')
    SystemSetting = apps.get_model('cafemap', 'SystemSetting')

    # 既にプリセットCustomが存在する場合はスキップ（冪等性確保）
    if Custom.objects.filter(is_public=True).exists():
        return

    # 1. デフォルト（システムデフォルト）
    default_custom = Custom.objects.create(
        name='デフォルト',
        description='システムデフォルトのカスタマイズ設定',
        map_style='default',
        icon_variant='photo',
        icon_color='#3B82F6',
        icon_size=48,
        show_labels=True,
        border_color=None,
        background_color=None,
        is_public=True,
        is_snapshot=False,
        created_by_user=None
    )

    # 2. ライトモード
    Custom.objects.create(
        name='ライトモード',
        description='明るい配色のマップスタイル',
        map_style='light',
        icon_variant='pin',
        icon_color='#4A90E2',
        icon_size=48,
        show_labels=True,
        border_color=None,
        background_color=None,
        is_public=True,
        is_snapshot=False,
        created_by_user=None
    )

    # 3. ダークモード
    Custom.objects.create(
        name='ダークモード',
        description='暗い配色のマップスタイル',
        map_style='dark',
        icon_variant='pin',
        icon_color='#FFD700',
        icon_size=48,
        show_labels=True,
        border_color=None,
        background_color=None,
        is_public=True,
        is_snapshot=False,
        created_by_user=None
    )

    # 4. カフェ巡り
    Custom.objects.create(
        name='カフェ巡り',
        description='カフェ探索に最適化された配色',
        map_style='light',
        icon_variant='badge',
        icon_color='#8B4513',
        icon_size=56,
        show_labels=False,
        border_color=None,
        background_color=None,
        is_public=True,
        is_snapshot=False,
        created_by_user=None
    )

    # 5. モノトーン
    Custom.objects.create(
        name='モノトーン',
        description='シンプルな白黒スタイル',
        map_style='mono',
        icon_variant='bubble',
        icon_color='#000000',
        icon_size=48,
        show_labels=True,
        border_color=None,
        background_color=None,
        is_public=True,
        is_snapshot=False,
        created_by_user=None
    )

    # SystemSettingにデフォルトCustomのIDを登録
    SystemSetting.objects.get_or_create(
        key='default_custom_id',
        defaults={
            'value': str(default_custom.id),
            'description': 'システムデフォルトのCustom ID'
        }
    )


def reverse_preset_customs(apps, schema_editor):
    """マイグレーションをロールバックする場合、プリセットCustomとSystemSettingを削除"""
    Custom = apps.get_model('cafemap', 'Custom')
    SystemSetting = apps.get_model('cafemap', 'SystemSetting')

    # プリセットCustomを全て削除
    Custom.objects.filter(is_public=True, is_snapshot=False).delete()

    # SystemSettingを削除
    SystemSetting.objects.filter(key='default_custom_id').delete()


class Migration(migrations.Migration):

    dependencies = [
        ('cafemap', '0004_custom_systemsetting_alter_sharedmap_original_map_and_more'),
    ]

    operations = [
        migrations.RunPython(create_preset_customs, reverse_preset_customs),
    ]
