# Generated manually for populating ShareChannel initial data

from django.db import migrations


def populate_share_channels(apps, schema_editor):
    """ShareChannelの初期データを投入"""
    ShareChannel = apps.get_model('cafemap', 'ShareChannel')

    channels = [
        {'key': 'x', 'name': 'X', 'sort_order': 1},
        {'key': 'blog', 'name': 'ブログ', 'sort_order': 2},
        {'key': 'email', 'name': 'メール', 'sort_order': 3},
        {'key': 'line', 'name': 'LINE', 'sort_order': 4},
        {'key': 'qr', 'name': 'QRコード', 'sort_order': 5},
        {'key': 'other', 'name': 'その他', 'sort_order': 6},
    ]

    for channel_data in channels:
        ShareChannel.objects.get_or_create(
            key=channel_data['key'],
            defaults={
                'name': channel_data['name'],
                'sort_order': channel_data['sort_order'],
                'is_active': True,
            }
        )


def reverse_populate_share_channels(apps, schema_editor):
    """ロールバック時の処理"""
    ShareChannel = apps.get_model('cafemap', 'ShareChannel')
    ShareChannel.objects.filter(
        key__in=['x', 'blog', 'email', 'line', 'qr', 'other']
    ).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('cafemap', '0002_sharechannel_sharedmap_direct_access_count_and_more'),
    ]

    operations = [
        migrations.RunPython(populate_share_channels, reverse_populate_share_channels),
    ]
