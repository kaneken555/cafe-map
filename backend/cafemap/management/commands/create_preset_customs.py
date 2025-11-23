"""プリセットCustomの初期データを作成する管理コマンド"""
from django.core.management.base import BaseCommand
from cafemap.models import Custom, SystemSetting


class Command(BaseCommand):
    help = 'プリセットCustomの初期データを作成'

    def handle(self, *args, **options):
        # 既に存在する場合はスキップ
        if Custom.objects.filter(is_public=True).exists():
            self.stdout.write(self.style.WARNING('プリセットCustomは既に存在します'))
            return

        self.stdout.write('プリセットCustomを作成します...')

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
        self.stdout.write(f'  ✓ {default_custom.name} (ID: {default_custom.id})')

        # 2. ライトモード
        light_custom = Custom.objects.create(
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
        self.stdout.write(f'  ✓ {light_custom.name} (ID: {light_custom.id})')

        # 3. ダークモード
        dark_custom = Custom.objects.create(
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
        self.stdout.write(f'  ✓ {dark_custom.name} (ID: {dark_custom.id})')

        # 4. カフェ巡り
        cafe_custom = Custom.objects.create(
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
        self.stdout.write(f'  ✓ {cafe_custom.name} (ID: {cafe_custom.id})')

        # 5. モノトーン
        mono_custom = Custom.objects.create(
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
        self.stdout.write(f'  ✓ {mono_custom.name} (ID: {mono_custom.id})')

        # SystemSettingにデフォルトCustomを登録
        system_setting, created = SystemSetting.objects.get_or_create(
            key='default_custom_id',
            defaults={
                'value': str(default_custom.id),
                'description': 'システムデフォルトのCustom ID'
            }
        )

        if created:
            self.stdout.write(f'  ✓ SystemSetting created (default_custom_id = {default_custom.id})')
        else:
            self.stdout.write(self.style.WARNING(f'  ! SystemSetting already exists (default_custom_id = {system_setting.value})'))

        self.stdout.write(self.style.SUCCESS('✨ プリセットCustomを作成しました'))
