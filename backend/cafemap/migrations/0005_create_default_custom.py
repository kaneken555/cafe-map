# Generated manually

from django.db import migrations


def create_default_custom(apps, schema_editor):
    """デフォルトCustom（ID=1）を作成"""
    Custom = apps.get_model('cafemap', 'Custom')

    # ID=1のデフォルトCustomを作成（既に存在する場合はスキップ）
    Custom.objects.get_or_create(
        id=1,
        defaults={
            'name': 'デフォルト',
            'description': 'システムデフォルトのカスタマイズ設定',
            'map_style': 'default',
            'icon_variant': 'photo',
            'icon_color': '#3B82F6',
            'icon_size': 40,
            'show_labels': True,
            'is_public': True,
            'is_snapshot': False,
        }
    )


def reverse_default_custom(apps, schema_editor):
    """マイグレーションをロールバックする場合、デフォルトCustomを削除"""
    Custom = apps.get_model('cafemap', 'Custom')
    Custom.objects.filter(id=1).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('cafemap', '0004_custom_systemsetting_alter_sharedmap_original_map_and_more'),
    ]

    operations = [
        migrations.RunPython(create_default_custom, reverse_default_custom),
    ]
