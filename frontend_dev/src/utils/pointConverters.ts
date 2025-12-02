/**
 * ポイント型変換ユーティリティ
 *
 * 統合ポイント型と既存の型（Cafe、CustomPlace）を相互変換する
 */
import { Point, CafePoint, CustomPlacePoint, isCafePoint, isCustomPlacePoint } from '../types/point';
import { Cafe } from '../types/cafe';
import { CustomPlace } from '../types/customPlace';

/**
 * CafePointをCafe型に変換
 *
 * @param cafePoint - カフェポイント
 * @returns Cafe型オブジェクト
 */
export function convertCafePointToCafe(cafePoint: CafePoint): Cafe {
  return {
    id: cafePoint.id,
    placeId: cafePoint.place_id || String(cafePoint.id),
    name: cafePoint.name,
    lat: cafePoint.latitude,
    lng: cafePoint.longitude,
    photoUrls: cafePoint.image_url ? [cafePoint.image_url] : [],
    rating: cafePoint.rating || 0,
    userRatingTotal: cafePoint.user_ratings_total,
    address: cafePoint.address || '',
    phoneNumber: cafePoint.phone_number,
    openTime: cafePoint.opening_hours || '',
    status: 'OPERATIONAL',
    distance: '',
    website: cafePoint.website,
    priceLevel: cafePoint.price_level,
  };
}

/**
 * CustomPlacePointをCustomPlace型に変換
 *
 * @param customPlacePoint - カスタム地点ポイント
 * @returns CustomPlace型オブジェクト
 */
export function convertCustomPlacePointToCustomPlace(
  customPlacePoint: CustomPlacePoint
): CustomPlace {
  return {
    id: customPlacePoint.id,
    owner: customPlacePoint.owner || { id: 0, name: 'Unknown' },
    name: customPlacePoint.name,
    latitude: customPlacePoint.latitude,
    longitude: customPlacePoint.longitude,
    image_url: customPlacePoint.image_url || undefined,
    place_type: (customPlacePoint.place_type as CustomPlace['place_type']) || undefined,
    place_type_display: customPlacePoint.place_type_display || undefined,
    memo: customPlacePoint.memo || undefined,
    created_at: customPlacePoint.created_at || '',
    updated_at: customPlacePoint.updated_at || '',
    maps: [], // maps フィールドは詳細取得時に別途取得
  };
}

/**
 * PointをCafeまたはCustomPlaceに変換
 *
 * @param point - 統合ポイント
 * @returns CafeまたはCustomPlace
 */
export function convertPointToOriginalType(point: Point): Cafe | CustomPlace {
  if (isCafePoint(point)) {
    return convertCafePointToCafe(point);
  } else {
    return convertCustomPlacePointToCustomPlace(point);
  }
}

/**
 * Pointの配列をCafeとCustomPlaceの配列に分離
 *
 * @param points - 統合ポイント配列
 * @returns カフェとカスタム地点の配列
 */
export function separatePoints(points: Point[]): {
  cafes: Cafe[];
  customPlaces: CustomPlace[];
} {
  const cafes: Cafe[] = [];
  const customPlaces: CustomPlace[] = [];

  points.forEach(point => {
    if (isCafePoint(point)) {
      cafes.push(convertCafePointToCafe(point));
    } else if (isCustomPlacePoint(point)) {
      customPlaces.push(convertCustomPlacePointToCustomPlace(point));
    }
  });

  return { cafes, customPlaces };
}

/**
 * CafeをCafePointに変換（主にテスト用）
 *
 * @param cafe - カフェ
 * @returns カフェポイント
 */
export function convertCafeToCafePoint(cafe: Cafe): CafePoint {
  return {
    type: 'cafe',
    id: cafe.id,
    name: cafe.name,
    latitude: cafe.lat,
    longitude: cafe.lng,
    image_url: cafe.photoUrls?.[0] || null,
    place_id: cafe.placeId,
    rating: cafe.rating,
    user_ratings_total: cafe.userRatingTotal,
    photo_urls: cafe.photoUrls,
    address: cafe.address,
    phone_number: cafe.phoneNumber,
    opening_hours: cafe.openTime,
    website: cafe.website,
    price_level: cafe.priceLevel,
  };
}

/**
 * CustomPlaceをCustomPlacePointに変換（主にテスト用）
 *
 * @param customPlace - カスタム地点
 * @returns カスタム地点ポイント
 */
export function convertCustomPlaceToCustomPlacePoint(
  customPlace: CustomPlace
): CustomPlacePoint {
  return {
    type: 'custom_place',
    id: customPlace.id,
    name: customPlace.name,
    latitude: customPlace.latitude,
    longitude: customPlace.longitude,
    image_url: customPlace.image_url || null,
    owner: customPlace.owner,
    place_type: customPlace.place_type || null,
    place_type_display: customPlace.place_type_display || null,
    memo: customPlace.memo || null,
    created_at: customPlace.created_at,
    updated_at: customPlace.updated_at,
  };
}
