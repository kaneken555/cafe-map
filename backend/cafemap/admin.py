from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (
    User, Cafe, Map, Tag, Memo, ShareMap, MapUserRelation, CafeMapRelation,
    CafeTagRelation, CafeMemoRelation, CafeShareMapRelation, Group,
    UserGroupRelation, GroupMapRelation, SharedMap, ShareChannel,
    SharedMapAnalyzeLink, Custom, SystemSetting, UserCustomRelation,
    ChatSession, ChatMessage, CustomPlace, CustomPlaceMapRelation
)

class UserAdmin(BaseUserAdmin):
    model = User
    list_display = ('id', 'name', 'email', 'is_staff', 'is_superuser', 'is_active')
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    ordering = ('id',)
    search_fields = ('name', 'email')

    fieldsets = (
        (None, {'fields': ('name', 'email', 'password')}),
        ('権限', {'fields': ('is_staff', 'is_superuser', 'is_active')}),
        ('日付', {'fields': ('last_login',)}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('name', 'email', 'password1', 'password2', 'is_staff', 'is_superuser', 'is_active'),
        }),
    )

admin.site.register(User, UserAdmin)



@admin.register(Cafe)
class CafeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'address', 'rating', 'user_ratings_total', 'created_at')
    search_fields = ('name', 'address')
    list_filter = ('rating',)
    ordering = ('-created_at',)

@admin.register(Map)
class MapAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created_at')
    search_fields = ('name',)

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'color', 'created_at')
    search_fields = ('name',)

@admin.register(Memo)
class MemoAdmin(admin.ModelAdmin):
    list_display = ('id', 'memo', 'created_at')
    search_fields = ('memo',)

@admin.register(ShareMap)
class ShareMapAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created_at')
    search_fields = ('name',)


@admin.register(MapUserRelation)
class MapUserRelationAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'map', 'created_at')

@admin.register(CafeMapRelation)
class CafeMapRelationAdmin(admin.ModelAdmin):
    list_display = ('id', 'cafe', 'map', 'created_at')

@admin.register(CafeTagRelation)
class CafeTagRelationAdmin(admin.ModelAdmin):
    list_display = ('id', 'cafe', 'tag', 'created_at')

@admin.register(CafeMemoRelation)
class CafeMemoRelationAdmin(admin.ModelAdmin):
    list_display = ('id', 'cafe', 'memo', 'created_at')

@admin.register(CafeShareMapRelation)
class CafeShareMapRelationAdmin(admin.ModelAdmin):
    list_display = ('id', 'cafe', 'share_map', 'created_at')

# Groupモデルの表示設定
@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "description", "created_at", "updated_at")
    search_fields = ("name",)
    ordering = ("-created_at",)

# ユーザーとグループの関係モデル
@admin.register(UserGroupRelation)
class UserGroupRelationAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "group", "created_at")
    search_fields = ("user__name", "group__name")
    list_filter = ("group",)
    ordering = ("-created_at",)

# グループとマップの関係モデル
@admin.register(GroupMapRelation)
class GroupMapRelationAdmin(admin.ModelAdmin):
    list_display = ("id", "group", "map", "created_at")
    search_fields = ("group__name", "map__name")
    list_filter = ("group",)
    ordering = ("-created_at",)

# SharedMapモデル（アナライズ機能）
@admin.register(SharedMap)
class SharedMapAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "share_uuid", "creator", "direct_access_count", "is_active", "created_at")
    search_fields = ("title", "share_uuid")
    list_filter = ("is_active", "created_at")
    readonly_fields = ("share_uuid", "created_at")
    ordering = ("-created_at",)

# 共有先マスタ（アナライズ機能）
@admin.register(ShareChannel)
class ShareChannelAdmin(admin.ModelAdmin):
    list_display = ("id", "key", "name", "sort_order", "is_active", "created_at")
    search_fields = ("key", "name")
    list_filter = ("is_active",)
    ordering = ("sort_order",)

# SharedMap × 共有先ごとの集計（アナライズ機能）
@admin.register(SharedMapAnalyzeLink)
class SharedMapAnalyzeLinkAdmin(admin.ModelAdmin):
    list_display = ("id", "shared_map", "channel", "custom_label", "access_count", "last_accessed_at", "is_active", "created_at")
    search_fields = ("shared_map__title", "channel__name", "custom_label")
    list_filter = ("channel", "is_active", "created_at")
    readonly_fields = ("created_at", "updated_at")
    ordering = ("-created_at",)

# カスタマイズ設定（Custom）
@admin.register(Custom)
class CustomAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "map_style", "icon_variant", "icon_color", "icon_size", "is_public", "is_snapshot", "created_by_user", "created_at")
    search_fields = ("name", "description")
    list_filter = ("is_public", "is_snapshot", "map_style", "icon_variant", "created_at")
    readonly_fields = ("created_at", "updated_at")
    ordering = ("-is_public", "-created_at")

    fieldsets = (
        ("基本情報", {
            "fields": ("name", "description", "created_by_user")
        }),
        ("マップ設定", {
            "fields": ("map_style", "icon_variant", "icon_color", "icon_size", "show_labels")
        }),
        ("詳細設定", {
            "fields": ("border_color", "background_color")
        }),
        ("システム設定", {
            "fields": ("is_public", "is_snapshot", "original_custom")
        }),
        ("日時", {
            "fields": ("created_at", "updated_at")
        }),
    )

# システム設定
@admin.register(SystemSetting)
class SystemSettingAdmin(admin.ModelAdmin):
    list_display = ("id", "key", "value", "description", "updated_at")
    search_fields = ("key", "description")
    readonly_fields = ("created_at", "updated_at")
    ordering = ("key",)

# ユーザー × カスタマイズ設定の関係
@admin.register(UserCustomRelation)
class UserCustomRelationAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "custom", "created_at")
    search_fields = ("user__name", "custom__name")
    list_filter = ("custom__is_public", "created_at")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)


# ==================== チャット機能 ====================

@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "title", "context_type", "is_active", "last_message_at", "created_at")
    search_fields = ("user__name", "title")
    list_filter = ("context_type", "is_active", "created_at")
    readonly_fields = ("created_at", "updated_at", "last_message_at")
    ordering = ("-last_message_at",)

    fieldsets = (
        ("基本情報", {
            "fields": ("user", "map", "title")
        }),
        ("コンテキスト", {
            "fields": ("context_type", "context_data")
        }),
        ("ステータス", {
            "fields": ("is_active",)
        }),
        ("日時", {
            "fields": ("created_at", "updated_at", "last_message_at")
        }),
    )


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ("id", "session", "role", "content_preview", "tokens_used", "response_time_ms", "created_at")
    search_fields = ("content", "session__user__name")
    list_filter = ("role", "created_at")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)

    fieldsets = (
        ("基本情報", {
            "fields": ("session", "role", "content")
        }),
        ("メタデータ", {
            "fields": ("tokens_used", "response_time_ms", "model_name")
        }),
        ("コンテキスト連携", {
            "fields": ("related_cafes", "related_location"),
            "classes": ("collapse",)
        }),
        ("日時", {
            "fields": ("created_at",)
        }),
    )

    def content_preview(self, obj):
        """コンテンツのプレビュー表示"""
        return obj.content[:100] + "..." if len(obj.content) > 100 else obj.content
    content_preview.short_description = "メッセージ内容"


@admin.register(CustomPlace)
class CustomPlaceAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "owner", "place_type", "latitude", "longitude", "created_at")
    search_fields = ("name", "owner__name", "memo")
    list_filter = ("place_type", "created_at")
    readonly_fields = ("created_at", "updated_at")
    ordering = ("-created_at",)

    fieldsets = (
        ("基本情報", {
            "fields": ("owner", "name")
        }),
        ("位置情報", {
            "fields": ("latitude", "longitude")
        }),
        ("追加情報", {
            "fields": ("image", "place_type", "memo")
        }),
        ("日時", {
            "fields": ("created_at", "updated_at")
        }),
    )


@admin.register(CustomPlaceMapRelation)
class CustomPlaceMapRelationAdmin(admin.ModelAdmin):
    list_display = ("id", "custom_place", "map", "is_visible", "created_at")
    search_fields = ("custom_place__name", "map__name")
    list_filter = ("is_visible", "created_at")
    readonly_fields = ("created_at",)
    ordering = ("-created_at",)