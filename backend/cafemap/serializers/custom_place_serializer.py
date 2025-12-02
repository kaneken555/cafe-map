from rest_framework import serializers
from cafemap.models import CustomPlace, CustomPlaceMapRelation, Map, User


class CustomPlaceOwnerSerializer(serializers.ModelSerializer):
    """所有者情報のシリアライザー"""
    class Meta:
        model = User
        fields = ['id', 'name']


class CustomPlaceMapSerializer(serializers.ModelSerializer):
    """マップ情報のシリアライザー"""
    is_visible = serializers.SerializerMethodField()

    class Meta:
        model = Map
        fields = ['id', 'name', 'is_visible']

    def get_is_visible(self, obj):
        # コンテキストからカスタム地点を取得して、is_visibleを返す
        custom_place = self.context.get('custom_place')
        if custom_place:
            relation = CustomPlaceMapRelation.objects.filter(
                map=obj,
                custom_place=custom_place
            ).first()
            return relation.is_visible if relation else True
        return True


class CustomPlaceSerializer(serializers.ModelSerializer):
    """カスタム地点シリアライザー"""
    owner = CustomPlaceOwnerSerializer(read_only=True)
    image_url = serializers.SerializerMethodField()
    place_type_display = serializers.CharField(source='get_place_type_display', read_only=True)
    maps = serializers.SerializerMethodField()
    # FormDataからJSON文字列として送られてくるため、CharFieldで受け取る
    map_ids = serializers.CharField(
        write_only=True,
        required=False,
        allow_blank=True
    )

    class Meta:
        model = CustomPlace
        fields = [
            'id', 'owner', 'name', 'latitude', 'longitude',
            'image', 'image_url', 'place_type', 'place_type_display',
            'memo', 'created_at', 'updated_at', 'maps', 'map_ids'
        ]
        read_only_fields = ['id', 'owner', 'created_at', 'updated_at']

    def get_image_url(self, obj):
        """画像URLを取得"""
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def get_maps(self, obj):
        """関連するマップ一覧を取得"""
        relations = CustomPlaceMapRelation.objects.filter(
            custom_place=obj
        ).select_related('map')
        return [
            {
                'id': rel.map.id,
                'name': rel.map.name,
                'is_visible': rel.is_visible
            }
            for rel in relations
        ]

    def create(self, validated_data):
        """カスタム地点を作成（map_idsは除外）"""
        # map_ids はモデルのフィールドではないので除外
        # ビューでマップとの関連付けを行う
        validated_data.pop('map_ids', None)
        return super().create(validated_data)

    def validate_name(self, value):
        """名前のバリデーション"""
        if not value or not value.strip():
            raise serializers.ValidationError("名前は必須です")
        if len(value) > 100:
            raise serializers.ValidationError("名前は100文字以内で入力してください")
        return value.strip()

    def validate_latitude(self, value):
        """緯度のバリデーション"""
        if value < -90 or value > 90:
            raise serializers.ValidationError("緯度は-90から90の範囲で入力してください")
        return value

    def validate_longitude(self, value):
        """経度のバリデーション"""
        if value < -180 or value > 180:
            raise serializers.ValidationError("経度は-180から180の範囲で入力してください")
        return value

    def validate_image(self, value):
        """画像のバリデーション"""
        if value:
            # ファイルサイズ検証
            if value.size > 5 * 1024 * 1024:  # 5MB
                raise serializers.ValidationError("画像のサイズは5MB以下にしてください")

            # ファイル形式検証
            allowed_extensions = ['jpg', 'jpeg', 'png']
            ext = value.name.split('.')[-1].lower()
            if ext not in allowed_extensions:
                raise serializers.ValidationError("画像はjpeg, jpg, pngのいずれかで選択してください")

        return value

    def validate_memo(self, value):
        """メモのバリデーション"""
        if value and len(value) > 500:
            raise serializers.ValidationError("メモは500文字以内で入力してください")
        return value

    def validate_map_ids(self, value):
        """map_ids のバリデーション（JSON文字列からのパースも含む）"""
        import json
        import logging

        logger = logging.getLogger(__name__)
        logger.info(f"validate_map_ids 受信した値: '{value}', 型: {type(value)}")

        # 空文字列の場合は空リストを返す
        if not value or value == '':
            logger.info("map_ids が空のため空リストを返します")
            return []

        # 文字列の場合はJSONとしてパース
        if isinstance(value, str):
            try:
                value = json.loads(value)
                logger.info(f"JSON パース成功: {value}, 型: {type(value)}")
            except json.JSONDecodeError as e:
                logger.error(f"JSON パースエラー: {e}")
                raise serializers.ValidationError(f"map_idsは有効なJSON配列である必要があります: {str(e)}")

        # すでにリストの場合（通常はここには来ないが念のため）
        if isinstance(value, list):
            # 各要素が整数であることを確認して変換
            validated_ids = []
            for item in value:
                if isinstance(item, int):
                    validated_ids.append(item)
                else:
                    try:
                        validated_ids.append(int(item))
                    except (ValueError, TypeError):
                        logger.error(f"整数変換エラー: {item}, 型: {type(item)}")
                        raise serializers.ValidationError(f"map_idsの全ての要素は整数である必要があります")
            logger.info(f"検証成功: {validated_ids}")
            return validated_ids

        # リストでも文字列でもない場合はエラー
        logger.error(f"予期しない型: {type(value)}")
        raise serializers.ValidationError("map_idsはJSON配列文字列である必要があります")


class CustomPlaceMapRelationSerializer(serializers.ModelSerializer):
    """カスタム地点とマップの関連シリアライザー"""
    custom_place_name = serializers.CharField(source='custom_place.name', read_only=True)
    map_name = serializers.CharField(source='map.name', read_only=True)

    class Meta:
        model = CustomPlaceMapRelation
        fields = [
            'id', 'map', 'map_name', 'custom_place', 'custom_place_name',
            'is_visible', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
