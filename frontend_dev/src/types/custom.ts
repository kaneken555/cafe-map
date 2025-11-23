/**
 * カスタマイズ設定の型定義
 */

/**
 * マップスタイルの種類
 */
export type MapStyle = 'default' | 'light' | 'dark' | 'mono';

/**
 * アイコン表現の種類
 */
export type IconVariant = 'pin' | 'badge' | 'bubble' | 'photo';

/**
 * Customオブジェクトの型定義
 */
export interface Custom {
  id: number;
  name: string;
  description?: string;
  map_style: MapStyle;
  icon_variant: IconVariant;
  icon_color: string;
  icon_size: number;
  show_labels: boolean;
  border_color?: string;
  background_color?: string;
  is_public: boolean;
  is_snapshot: boolean;
  original_custom_id?: number;
  created_by_user_id?: number;
  created_at: string;
  updated_at: string;
  used_by_maps_count: number;
}

/**
 * Custom新規作成・更新用のデータ型
 */
export interface CustomFormData {
  name: string;
  description?: string;
  map_style: MapStyle;
  icon_variant: IconVariant;
  icon_color: string;
  icon_size: number;
  show_labels: boolean;
  border_color?: string;
  background_color?: string;
}

/**
 * Custom一覧取得APIのレスポンス型
 */
export interface CustomListResponse {
  customs: Custom[];
}

/**
 * MapへのCustom適用リクエスト型
 */
export interface ApplyCustomRequest {
  custom_id: number;
}
