"""カスタマイズ機能のユーティリティ関数"""


def get_default_custom_id():
    """
    システムデフォルトのCustom IDを取得

    Returns:
        int: デフォルトCustomのID
    """
    # 循環importを避けるため、関数内でimport
    from cafemap.models import Custom, SystemSetting

    try:
        setting = SystemSetting.objects.get(key='default_custom_id')
        return int(setting.value)
    except SystemSetting.DoesNotExist:
        # フォールバック: is_public=Trueの最初のCustom
        default = Custom.objects.filter(is_public=True, is_snapshot=False).first()
        if default:
            return default.id
        # 最終フォールバック（マイグレーション中など）
        return 1
    except Exception:
        # エラー時のフォールバック
        return 1
