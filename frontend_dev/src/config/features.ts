/**
 * フィーチャーフラグ設定
 *
 * 新機能の段階的ロールアウトやA/Bテストのための設定
 */

export const FEATURES = {
  /**
   * 統合ポイントAPIを使用するかどうか（フェーズ4実装完了・フェーズ5テスト完了）
   *
   * true: 新しい統合API (/api/v1/maps/{map_id}/points/) を使用
   *       - APIコール数: 2回 → 1回（50%削減）
   *       - カフェとカスタム地点を1回のリクエストで取得
   *       - UnifiedPointOverlayIconを使用してレンダリング
   *
   * false: 既存のAPI（カフェとカスタム地点を個別取得）を使用
   *       - APIコール数: 2回
   *       - 個別のコンポーネント（CafeOverlayIcon, CustomPlaceOverlayIcon）を使用
   *
   * 影響範囲:
   * - useHeaderActions.ts: データ取得ロジック
   * - HomePage.tsx: カスタム地点取得のスキップ
   * - Map.tsx: レンダリングコンポーネントの切り替え
   *
   * ロールバック: このフラグをfalseにするだけで即座に元に戻せます
   *
   * テスト状況:
   * - ✅ ユニットテスト: 18個のテストケース全て成功
   * - ✅ TypeScript型チェック: エラーなし
   * - ✅ ビルド: 成功
   * - ⏳ 本番環境での段階的ロールアウト待ち
   */
  USE_UNIFIED_POINTS_API: false,
} as const;

/**
 * フィーチャーフラグの型定義
 */
export type FeatureFlags = typeof FEATURES;

/**
 * フィーチャーフラグが有効かどうかをチェック
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return Boolean(FEATURES[feature]);
}
