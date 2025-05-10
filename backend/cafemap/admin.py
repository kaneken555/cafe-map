from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Cafe, Map, Tag, Memo, ShareMap,MapUserRelation, CafeMapRelation, CafeTagRelation, CafeMemoRelation, CafeShareMapRelation

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