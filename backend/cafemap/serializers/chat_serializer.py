from rest_framework import serializers
from cafemap.models import ChatSession, ChatMessage


class ChatMessageSerializer(serializers.ModelSerializer):
    """チャットメッセージのシリアライザー"""

    class Meta:
        model = ChatMessage
        fields = [
            'id',
            'role',
            'content',
            'tokens_used',
            'response_time_ms',
            'model_name',
            'related_cafes',
            'related_location',
            'created_at',
        ]
        read_only_fields = [
            'id',
            'tokens_used',
            'response_time_ms',
            'model_name',
            'created_at',
        ]


class ChatSessionSerializer(serializers.ModelSerializer):
    """チャットセッションのシリアライザー"""
    message_count = serializers.SerializerMethodField()

    class Meta:
        model = ChatSession
        fields = [
            'id',
            'map',
            'context_type',
            'context_data',
            'title',
            'is_active',
            'created_at',
            'updated_at',
            'last_message_at',
            'message_count',
        ]
        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
            'last_message_at',
        ]

    def get_message_count(self, obj):
        """セッション内のメッセージ数を取得"""
        return obj.messages.count()


class ChatSessionDetailSerializer(serializers.ModelSerializer):
    """チャットセッション詳細のシリアライザー（メッセージ含む）"""
    messages = ChatMessageSerializer(many=True, read_only=True)
    message_count = serializers.SerializerMethodField()

    class Meta:
        model = ChatSession
        fields = [
            'id',
            'map',
            'context_type',
            'context_data',
            'title',
            'is_active',
            'created_at',
            'updated_at',
            'last_message_at',
            'message_count',
            'messages',
        ]
        read_only_fields = [
            'id',
            'created_at',
            'updated_at',
            'last_message_at',
        ]

    def get_message_count(self, obj):
        """セッション内のメッセージ数を取得"""
        return obj.messages.count()


class SendMessageSerializer(serializers.Serializer):
    """メッセージ送信用のシリアライザー"""
    session_id = serializers.IntegerField()
    content = serializers.CharField(max_length=2000)
    context = serializers.JSONField(required=False, allow_null=True)

    def validate_content(self, value):
        """コンテンツのバリデーション"""
        if len(value.strip()) == 0:
            raise serializers.ValidationError("空のメッセージは送信できません")
        return value.strip()

    def validate_session_id(self, value):
        """セッションIDのバリデーション"""
        if value <= 0:
            raise serializers.ValidationError("無効なセッションIDです")
        return value
