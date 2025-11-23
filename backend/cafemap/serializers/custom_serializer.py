"""カスタマイズ設定のシリアライザー"""
import re
from rest_framework import serializers
from cafemap.models import Custom


class CustomSerializer(serializers.ModelSerializer):
    """Customモデルのシリアライザー"""
    used_by_maps_count = serializers.SerializerMethodField()

    class Meta:
        model = Custom
        fields = [
            'id', 'name', 'description',
            'map_style', 'icon_variant', 'icon_color', 'icon_size', 'show_labels',
            'border_color', 'background_color',
            'is_snapshot', 'is_public', 'original_custom_id', 'created_by_user_id',
            'created_at', 'updated_at',
            'used_by_maps_count'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at', 'is_snapshot',
            'created_by_user_id', 'used_by_maps_count'
        ]

    def get_used_by_maps_count(self, obj):
        """このCustomを使用しているMap件数を取得"""
        return obj.maps.count()

    def validate_name(self, value):
        """名前のバリデーション"""
        if not value or not value.strip():
            raise serializers.ValidationError('カスタマイズ設定名を入力してください')
        if len(value) > 255:
            raise serializers.ValidationError('カスタマイズ設定名は255文字以内で入力してください')
        return value.strip()

    def validate_description(self, value):
        """説明のバリデーション"""
        if value and len(value) > 1000:
            raise serializers.ValidationError('説明は1000文字以内で入力してください')
        return value

    def validate_map_style(self, value):
        """マップスタイルのバリデーション"""
        allowed_styles = ['default', 'light', 'dark', 'mono']
        if value not in allowed_styles:
            raise serializers.ValidationError(
                f'マップスタイルは {", ".join(allowed_styles)} のいずれかを指定してください'
            )
        return value

    def validate_icon_variant(self, value):
        """アイコン表現のバリデーション"""
        allowed_variants = ['pin', 'badge', 'bubble', 'photo']
        if value not in allowed_variants:
            raise serializers.ValidationError(
                f'アイコン表現は {", ".join(allowed_variants)} のいずれかを指定してください'
            )
        return value

    def validate_icon_color(self, value):
        """アイコンカラーのバリデーション"""
        if not re.match(r'^#[0-9A-Fa-f]{6}$', value):
            raise serializers.ValidationError('正しい色コードを入力してください（例: #FF0000）')
        return value

    def validate_border_color(self, value):
        """枠線色のバリデーション"""
        if value and not re.match(r'^#[0-9A-Fa-f]{6}$', value):
            raise serializers.ValidationError('正しい色コードを入力してください（例: #FF0000）')
        return value

    def validate_background_color(self, value):
        """背景色のバリデーション"""
        if value and not re.match(r'^#[0-9A-Fa-f]{6}$', value):
            raise serializers.ValidationError('正しい色コードを入力してください（例: #FF0000）')
        return value

    def validate_icon_size(self, value):
        """アイコンサイズのバリデーション"""
        if not 24 <= value <= 96:
            raise serializers.ValidationError('アイコンサイズは24〜96の範囲で指定してください')
        return value
