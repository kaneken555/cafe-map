/**
 * 統合ポイント型定義
 *
 * カフェとカスタム地点を統一的に扱うための型定義
 */

export type PointType = 'cafe' | 'custom_place';

/**
 * 基本ポイント情報（マップ表示用）
 */
export interface BasePoint {
  type: PointType;
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  image_url: string | null;
}

/**
 * カフェポイント
 */
export interface CafePoint extends BasePoint {
  type: 'cafe';

  // 詳細情報（fields=detailedの場合のみ含まれる）
  place_id?: string;
  rating?: number;
  user_ratings_total?: number;
  photo_urls?: string[];
  address?: string;
  phone_number?: string;
  opening_hours?: string;
  website?: string;
  price_level?: number;
}

/**
 * カスタム地点ポイント
 */
export interface CustomPlacePoint extends BasePoint {
  type: 'custom_place';
  is_visible?: boolean;

  // 詳細情報（fields=detailedの場合のみ含まれる）
  owner?: {
    id: number;
    name: string;
  };
  place_type?: string | null;
  place_type_display?: string | null;
  memo?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * 統合ポイント型（CafePointまたはCustomPlacePoint）
 */
export type Point = CafePoint | CustomPlacePoint;

/**
 * マップポイント一覧APIレスポンス
 */
export interface MapPointsResponse {
  map: {
    id: number;
    name: string;
  };
  points: Point[];
  total_count: number;
  cafe_count: number;
  custom_place_count: number;
}

/**
 * API取得オプション
 */
export interface FetchMapPointsOptions {
  /** 取得する情報の詳細度 */
  fields?: 'basic' | 'detailed';
  /** 表示中のカスタム地点のみ取得するか */
  visibleOnly?: boolean;
}

// ========================================
// 型ガード関数
// ========================================

/**
 * カフェポイントかどうかを判定
 */
export function isCafePoint(point: Point): point is CafePoint {
  return point.type === 'cafe';
}

/**
 * カスタム地点ポイントかどうかを判定
 */
export function isCustomPlacePoint(point: Point): point is CustomPlacePoint {
  return point.type === 'custom_place';
}
