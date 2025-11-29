from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
import uuid


class CustomUserManager(BaseUserManager):
    def create_user(self, name, password=None, **extra_fields):
        if not name:
            raise ValueError("ユーザー名は必須です")

        user = self.model(name=name, **extra_fields)  # ← 修正ここ！
        
        # パスワードを設定
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()  # ゲストユーザー用にパスワードなしを許可
        
        user.save(using=self._db)
        return user

    def create_superuser(self, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(name, password, **extra_fields)
    
class User(AbstractBaseUser, PermissionsMixin):  # AbstractBaseUserを継承
    name = models.CharField(max_length=255, unique=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'name'

    def __str__(self):
        return self.name


class Map(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    # カスタマイズ設定（後で定義されるCustomモデルを参照）
    # custom フィールドはファイル末尾で追加
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class MapUserRelation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    map = models.ForeignKey(Map, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

# TODO: フィールドを修正
class Cafe(models.Model):
    place_id = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    address = models.TextField()
    latitude = models.DecimalField(max_digits=10, decimal_places=7)
    longitude = models.DecimalField(max_digits=10, decimal_places=7)
    rating = models.FloatField(null=True, blank=True)
    user_ratings_total = models.IntegerField(null=True, blank=True)
    price_level = models.IntegerField(null=True, blank=True)
    photo_reference = models.CharField(max_length=255, null=True, blank=True)
    photo_url = models.CharField(max_length=255, null=True, blank=True)
    photo_urls = models.JSONField(null=True, blank=True)
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    opening_hours = models.TextField(null=True, blank=True)
    website = models.URLField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class CafeMapRelation(models.Model):
    map = models.ForeignKey(Map, on_delete=models.CASCADE)
    cafe = models.ForeignKey(Cafe, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class Tag(models.Model):
    name = models.CharField(max_length=255, unique=True)
    color = models.CharField(max_length=10, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class CafeTagRelation(models.Model):
    cafe = models.ForeignKey(Cafe, on_delete=models.CASCADE)
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class Memo(models.Model):
    memo = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class CafeMemoRelation(models.Model):
    cafe = models.ForeignKey(Cafe, on_delete=models.CASCADE)
    memo = models.ForeignKey(Memo, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class ShareMap(models.Model):
    name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class CafeShareMapRelation(models.Model):
    share_map = models.ForeignKey(ShareMap, on_delete=models.CASCADE)
    cafe = models.ForeignKey(Cafe, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


# Group モデル
class Group(models.Model):
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


# ユーザーとグループの中間テーブル
class UserGroupRelation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'group')  # 重複参加を防止


# グループとマップの中間テーブル
class GroupMapRelation(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    map = models.ForeignKey(Map, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('group', 'map')  # 重複紐付けを防止

# 共有マップモデル
class SharedMap(models.Model):  # ← 旧ShareMapをこれに統一推奨
    original_map = models.OneToOneField(  # ← ForeignKeyからOneToOneFieldに変更（UNIQUE制約）
        Map,
        on_delete=models.CASCADE,
        related_name='shared_map'
    )
    share_uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    creator = models.ForeignKey(User, on_delete=models.CASCADE)
    # カスタマイズ設定（スナップショット用、後で動的に追加）
    # custom フィールドはファイル末尾で追加
    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    allow_sync = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)  # is_publicの代わりに使用
    # アナライズ機能: 直接アクセス用
    direct_access_count = models.IntegerField(default=0)
    direct_last_accessed_at = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.title or 'No Title'} ({self.share_uuid})"


class CafeSharedMapRelation(models.Model):
    shared_map = models.ForeignKey(SharedMap, on_delete=models.CASCADE)
    cafe = models.ForeignKey(Cafe, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


class UserSharedMapRelation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    shared_map = models.ForeignKey(SharedMap, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'shared_map')  # 重複登録を防止


# アナライズ機能: 共有先マスタ
class ShareChannel(models.Model):
    key = models.CharField(max_length=50, unique=True)  # 'x', 'blog', 'email', etc.
    name = models.CharField(max_length=100)  # 'X', 'ブログ', 'メール', etc.
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=100, blank=True, null=True)
    sort_order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'share_channel'
        indexes = [
            models.Index(fields=['is_active', 'sort_order']),
        ]

    def __str__(self):
        return self.name


# アナライズ機能: SharedMap × 共有先ごとの集計
class SharedMapAnalyzeLink(models.Model):
    shared_map = models.ForeignKey(SharedMap, on_delete=models.CASCADE)
    channel = models.ForeignKey(ShareChannel, on_delete=models.CASCADE)
    custom_label = models.CharField(max_length=255, blank=True, null=True)
    share_link_url = models.TextField()
    access_count = models.IntegerField(default=0)
    last_accessed_at = models.DateTimeField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'shared_map_analyze_link'
        unique_together = [['shared_map', 'channel']]  # 1 SharedMap × 1 共有先につき1レコード
        indexes = [
            models.Index(fields=['shared_map']),
            models.Index(fields=['shared_map', 'is_active']),
        ]

    def __str__(self):
        return f"{self.shared_map.title or 'No Title'} - {self.channel.name}"


# カスタマイズ設定モデル
class Custom(models.Model):
    """カスタマイズ設定"""
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)

    # マップ・アイコン設定
    map_style = models.CharField(max_length=50, default='default')  # default, light, dark, mono
    icon_variant = models.CharField(max_length=50, default='photo')  # pin, badge, bubble, photo
    icon_color = models.CharField(max_length=7, default='#3B82F6')  # #RRGGBB
    icon_size = models.IntegerField(default=48)  # 24-96
    show_labels = models.BooleanField(default=True)

    # 将来用
    border_color = models.CharField(max_length=7, blank=True, null=True)
    background_color = models.CharField(max_length=7, blank=True, null=True)

    # メタ情報
    created_by_user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='customs'
    )
    is_snapshot = models.BooleanField(default=False)
    is_public = models.BooleanField(default=False)
    original_custom = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='snapshots'
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'custom'
        indexes = [
            models.Index(fields=['created_by_user']),
            models.Index(fields=['is_public', 'is_snapshot']),
        ]

    def __str__(self):
        return self.name


# システム設定モデル
class SystemSetting(models.Model):
    """システム設定"""
    key = models.CharField(max_length=255, unique=True)
    value = models.TextField()
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'system_setting'

    def __str__(self):
        return f"{self.key}: {self.value}"


# ユーザーとCustomの関係（お気に入り管理）
class UserCustomRelation(models.Model):
    """ユーザーとCustomの関係（お気に入り管理）"""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    custom = models.ForeignKey(Custom, on_delete=models.CASCADE)
    is_favorite = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user_custom_relation'
        unique_together = ('user', 'custom')

    def __str__(self):
        return f"{self.user.name} - {self.custom.name}"


# Mapモデルにcustomフィールドを追加（Customモデル定義後に追加）
from cafemap.utils.custom_utils import get_default_custom_id

# ForeignKeyを動的に追加
Map.add_to_class(
    'custom',
    models.ForeignKey(
        Custom,
        on_delete=models.SET_NULL,
        related_name='maps',
        null=True,
        blank=True
    )
)

# SharedMapモデルにcustomフィールドを追加（スナップショットCustom用）
SharedMap.add_to_class(
    'custom',
    models.ForeignKey(
        Custom,
        on_delete=models.SET_NULL,
        related_name='shared_maps',
        null=True,
        blank=True
    )
)


# ==================== チャット機能 ====================

class ChatSession(models.Model):
    """チャットセッション（会話単位）"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_sessions')
    map = models.ForeignKey(Map, on_delete=models.SET_NULL, null=True, blank=True, related_name='chat_sessions')

    # コンテキスト情報
    context_type = models.CharField(max_length=50, default='general')  # general, cafe_search, map_creation
    context_data = models.JSONField(null=True, blank=True)  # 位置情報、選択中のカフェIDなど

    # メタ情報
    title = models.CharField(max_length=255, blank=True, null=True)  # 自動生成または手動設定
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_message_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'chat_session'
        indexes = [
            models.Index(fields=['user', '-last_message_at']),
            models.Index(fields=['user', 'is_active']),
        ]

    def __str__(self):
        return f"{self.user.name} - {self.title or 'Untitled'} ({self.id})"


class ChatMessage(models.Model):
    """チャットメッセージ"""
    ROLE_CHOICES = [
        ('user', 'ユーザー'),
        ('assistant', 'AI'),
        ('system', 'システム'),
    ]

    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name='messages')
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    content = models.TextField()

    # メタデータ
    tokens_used = models.IntegerField(null=True, blank=True)  # トークン数記録
    response_time_ms = models.IntegerField(null=True, blank=True)  # 応答時間（ミリ秒）
    model_name = models.CharField(max_length=50, null=True, blank=True)  # 使用モデル

    # コンテキスト連携（フェーズ2用、今は未使用）
    related_cafes = models.JSONField(null=True, blank=True)  # 関連カフェID配列
    related_location = models.JSONField(null=True, blank=True)  # 緯度経度

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'chat_message'
        indexes = [
            models.Index(fields=['session', 'created_at']),
        ]
        ordering = ['created_at']

    def __str__(self):
        return f"{self.role}: {self.content[:50]}..."
