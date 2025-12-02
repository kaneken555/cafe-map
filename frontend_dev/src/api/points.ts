/**
 * 統合ポイントAPI
 *
 * カフェとカスタム地点を統一的に扱うAPI
 */
import { MapPointsResponse, FetchMapPointsOptions } from '../types/point';
import { API_BASE_PATH } from '../constants/api';

/**
 * マップの全地点を取得
 *
 * @param mapId - マップID
 * @param options - 取得オプション
 * @returns 統合ポイント一覧
 *
 * @example
 * // 基本情報のみ取得
 * const response = await fetchMapPoints(15);
 *
 * @example
 * // 詳細情報込みで取得
 * const response = await fetchMapPoints(15, { fields: 'detailed' });
 *
 * @example
 * // 表示中のカスタム地点のみ取得
 * const response = await fetchMapPoints(15, { visibleOnly: true });
 */
export async function fetchMapPoints(
  mapId: number,
  options?: FetchMapPointsOptions
): Promise<MapPointsResponse> {
  // クエリパラメータを構築
  const params = new URLSearchParams();

  if (options?.fields) {
    params.append('fields', options.fields);
  }

  if (options?.visibleOnly) {
    params.append('visible_only', 'true');
  }

  // URL構築
  const queryString = params.toString();
  const url = `${API_BASE_PATH}/maps/${mapId}/points/${queryString ? '?' + queryString : ''}`;

  // API呼び出し
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include', // セッション認証用のクッキーを含める
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // エラーハンドリング
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to fetch map points: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  // レスポンスをパース
  const data: MapPointsResponse = await response.json();

  return data;
}

/**
 * マップの全地点を取得（詳細情報込み）
 *
 * fetchMapPoints のショートカット関数
 *
 * @param mapId - マップID
 * @param visibleOnly - 表示中のカスタム地点のみ取得するか
 * @returns 統合ポイント一覧（詳細情報含む）
 */
export async function fetchMapPointsDetailed(
  mapId: number,
  visibleOnly: boolean = false
): Promise<MapPointsResponse> {
  return fetchMapPoints(mapId, { fields: 'detailed', visibleOnly });
}

/**
 * マップの全地点を取得（基本情報のみ）
 *
 * fetchMapPoints のショートカット関数
 *
 * @param mapId - マップID
 * @param visibleOnly - 表示中のカスタム地点のみ取得するか
 * @returns 統合ポイント一覧（基本情報のみ）
 */
export async function fetchMapPointsBasic(
  mapId: number,
  visibleOnly: boolean = false
): Promise<MapPointsResponse> {
  return fetchMapPoints(mapId, { fields: 'basic', visibleOnly });
}
