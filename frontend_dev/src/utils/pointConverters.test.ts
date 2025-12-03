/**
 * ポイント型変換ユーティリティのテスト
 */
import { describe, it, expect } from 'vitest';
import {
  convertCafePointToCafe,
  convertCustomPlacePointToCustomPlace,
  convertCafeToCafePoint,
  convertCustomPlaceToCustomPlacePoint,
  separatePoints,
} from './pointConverters';
import { CafePoint, CustomPlacePoint } from '../types/point';
import { Cafe } from '../types/cafe';
import { CustomPlace } from '../types/customPlace';

describe('pointConverters', () => {
  describe('convertCafePointToCafe', () => {
    it('CafePointを正しくCafe型に変換する', () => {
      const cafePoint: CafePoint = {
        type: 'cafe',
        id: 1,
        name: 'Test Cafe',
        latitude: 35.6590,
        longitude: 139.7004,
        image_url: 'https://example.com/photo.jpg',
        place_id: 'test_place_id',
        rating: 4.5,
        user_ratings_total: 100,
        photo_urls: ['https://example.com/photo1.jpg', 'https://example.com/photo2.jpg'],
        address: 'Test Address',
        phone_number: '03-1234-5678',
        opening_hours: '10:00-22:00',
        website: 'https://example.com',
        price_level: 2,
      };

      const cafe = convertCafePointToCafe(cafePoint);

      expect(cafe.id).toBe(1);
      expect(cafe.name).toBe('Test Cafe');
      expect(cafe.lat).toBe(35.6590);
      expect(cafe.lng).toBe(139.7004);
      expect(cafe.placeId).toBe('test_place_id');
      expect(cafe.rating).toBe(4.5);
      expect(cafe.userRatingTotal).toBe(100);
      expect(cafe.photoUrls).toEqual(['https://example.com/photo.jpg']);
      expect(cafe.address).toBe('Test Address');
      expect(cafe.phoneNumber).toBe('03-1234-5678');
      expect(cafe.openTime).toBe('10:00-22:00');
      expect(cafe.website).toBe('https://example.com');
      expect(cafe.priceLevel).toBe(2);
      expect(cafe.status).toBe('OPERATIONAL');
    });

    it('画像URLがnullの場合は空配列を返す', () => {
      const cafePoint: CafePoint = {
        type: 'cafe',
        id: 1,
        name: 'Test Cafe',
        latitude: 35.6590,
        longitude: 139.7004,
        image_url: null,
      };

      const cafe = convertCafePointToCafe(cafePoint);

      expect(cafe.photoUrls).toEqual([]);
    });

    it('place_idがない場合はidを文字列に変換して使用', () => {
      const cafePoint: CafePoint = {
        type: 'cafe',
        id: 123,
        name: 'Test Cafe',
        latitude: 35.6590,
        longitude: 139.7004,
        image_url: null,
      };

      const cafe = convertCafePointToCafe(cafePoint);

      expect(cafe.placeId).toBe('123');
    });
  });

  describe('convertCustomPlacePointToCustomPlace', () => {
    it('CustomPlacePointを正しくCustomPlace型に変換する', () => {
      const customPlacePoint: CustomPlacePoint = {
        type: 'custom_place',
        id: 5,
        name: 'Tokyo Tower',
        latitude: 35.6890,
        longitude: 139.7020,
        image_url: 'http://localhost:8000/media/custom_places/tower.jpg',
        owner: { id: 1, name: 'guest' },
        place_type: 'photo_spot',
        place_type_display: '写真スポット',
        memo: '絶景ポイント',
        created_at: '2025-12-01T19:53:39.388566+09:00',
        updated_at: '2025-12-01T19:53:39.388580+09:00',
      };

      const customPlace = convertCustomPlacePointToCustomPlace(customPlacePoint);

      expect(customPlace.id).toBe(5);
      expect(customPlace.name).toBe('Tokyo Tower');
      expect(customPlace.latitude).toBe(35.6890);
      expect(customPlace.longitude).toBe(139.7020);
      expect(customPlace.image_url).toBe('http://localhost:8000/media/custom_places/tower.jpg');
      expect(customPlace.owner).toEqual({ id: 1, name: 'guest' });
      expect(customPlace.place_type).toBe('photo_spot');
      expect(customPlace.place_type_display).toBe('写真スポット');
      expect(customPlace.memo).toBe('絶景ポイント');
      expect(customPlace.created_at).toBe('2025-12-01T19:53:39.388566+09:00');
      expect(customPlace.updated_at).toBe('2025-12-01T19:53:39.388580+09:00');
      expect(customPlace.maps).toEqual([]);
    });

    it('オプショナルフィールドがない場合はデフォルト値を使用', () => {
      const customPlacePoint: CustomPlacePoint = {
        type: 'custom_place',
        id: 5,
        name: 'Tokyo Tower',
        latitude: 35.6890,
        longitude: 139.7020,
        image_url: null,
      };

      const customPlace = convertCustomPlacePointToCustomPlace(customPlacePoint);

      expect(customPlace.owner).toEqual({ id: 0, name: 'Unknown' });
      expect(customPlace.place_type).toBeUndefined();
      expect(customPlace.place_type_display).toBeUndefined();
      expect(customPlace.memo).toBeUndefined();
      expect(customPlace.created_at).toBe('');
      expect(customPlace.updated_at).toBe('');
    });
  });

  describe('convertCafeToCafePoint', () => {
    it('CafeをCafePointに変換する', () => {
      const cafe: Cafe = {
        id: 1,
        placeId: 'test_place_id',
        name: 'Test Cafe',
        lat: 35.6590,
        lng: 139.7004,
        photoUrls: ['https://example.com/photo1.jpg'],
        rating: 4.5,
        userRatingTotal: 100,
        address: 'Test Address',
        phoneNumber: '03-1234-5678',
        openTime: '10:00-22:00',
        status: 'OPERATIONAL',
        distance: '500m',
        website: 'https://example.com',
        priceLevel: 2,
      };

      const cafePoint = convertCafeToCafePoint(cafe);

      expect(cafePoint.type).toBe('cafe');
      expect(cafePoint.id).toBe(1);
      expect(cafePoint.name).toBe('Test Cafe');
      expect(cafePoint.latitude).toBe(35.6590);
      expect(cafePoint.longitude).toBe(139.7004);
      expect(cafePoint.image_url).toBe('https://example.com/photo1.jpg');
      expect(cafePoint.place_id).toBe('test_place_id');
      expect(cafePoint.rating).toBe(4.5);
      expect(cafePoint.user_ratings_total).toBe(100);
      expect(cafePoint.photo_urls).toEqual(['https://example.com/photo1.jpg']);
      expect(cafePoint.address).toBe('Test Address');
      expect(cafePoint.phone_number).toBe('03-1234-5678');
      expect(cafePoint.opening_hours).toBe('10:00-22:00');
      expect(cafePoint.website).toBe('https://example.com');
      expect(cafePoint.price_level).toBe(2);
    });
  });

  describe('convertCustomPlaceToCustomPlacePoint', () => {
    it('CustomPlaceをCustomPlacePointに変換する', () => {
      const customPlace: CustomPlace = {
        id: 5,
        owner: { id: 1, name: 'guest' },
        name: 'Tokyo Tower',
        latitude: 35.6890,
        longitude: 139.7020,
        image_url: 'http://localhost:8000/media/custom_places/tower.jpg',
        place_type: 'photo_spot',
        place_type_display: '写真スポット',
        memo: '絶景ポイント',
        created_at: '2025-12-01T19:53:39.388566+09:00',
        updated_at: '2025-12-01T19:53:39.388580+09:00',
        maps: [],
      };

      const customPlacePoint = convertCustomPlaceToCustomPlacePoint(customPlace);

      expect(customPlacePoint.type).toBe('custom_place');
      expect(customPlacePoint.id).toBe(5);
      expect(customPlacePoint.name).toBe('Tokyo Tower');
      expect(customPlacePoint.latitude).toBe(35.6890);
      expect(customPlacePoint.longitude).toBe(139.7020);
      expect(customPlacePoint.image_url).toBe('http://localhost:8000/media/custom_places/tower.jpg');
      expect(customPlacePoint.owner).toEqual({ id: 1, name: 'guest' });
      expect(customPlacePoint.place_type).toBe('photo_spot');
      expect(customPlacePoint.place_type_display).toBe('写真スポット');
      expect(customPlacePoint.memo).toBe('絶景ポイント');
      expect(customPlacePoint.created_at).toBe('2025-12-01T19:53:39.388566+09:00');
      expect(customPlacePoint.updated_at).toBe('2025-12-01T19:53:39.388580+09:00');
    });
  });

  describe('separatePoints', () => {
    it('Point配列をカフェとカスタム地点に分離する', () => {
      const cafePoint: CafePoint = {
        type: 'cafe',
        id: 1,
        name: 'Test Cafe',
        latitude: 35.6590,
        longitude: 139.7004,
        image_url: 'https://example.com/photo.jpg',
        place_id: 'test_place_id',
      };

      const customPlacePoint: CustomPlacePoint = {
        type: 'custom_place',
        id: 5,
        name: 'Tokyo Tower',
        latitude: 35.6890,
        longitude: 139.7020,
        image_url: null,
      };

      const points = [cafePoint, customPlacePoint, cafePoint];

      const { cafes, customPlaces } = separatePoints(points);

      expect(cafes).toHaveLength(2);
      expect(customPlaces).toHaveLength(1);
      expect(cafes[0].id).toBe(1);
      expect(cafes[0].name).toBe('Test Cafe');
      expect(customPlaces[0].id).toBe(5);
      expect(customPlaces[0].name).toBe('Tokyo Tower');
    });

    it('空の配列を渡すと空の配列を返す', () => {
      const { cafes, customPlaces } = separatePoints([]);

      expect(cafes).toHaveLength(0);
      expect(customPlaces).toHaveLength(0);
    });

    it('カフェのみの配列を渡すとカスタム地点は空配列', () => {
      const cafePoint: CafePoint = {
        type: 'cafe',
        id: 1,
        name: 'Test Cafe',
        latitude: 35.6590,
        longitude: 139.7004,
        image_url: null,
      };

      const { cafes, customPlaces } = separatePoints([cafePoint, cafePoint]);

      expect(cafes).toHaveLength(2);
      expect(customPlaces).toHaveLength(0);
    });

    it('カスタム地点のみの配列を渡すとカフェは空配列', () => {
      const customPlacePoint: CustomPlacePoint = {
        type: 'custom_place',
        id: 5,
        name: 'Tokyo Tower',
        latitude: 35.6890,
        longitude: 139.7020,
        image_url: null,
      };

      const { cafes, customPlaces } = separatePoints([customPlacePoint, customPlacePoint]);

      expect(cafes).toHaveLength(0);
      expect(customPlaces).toHaveLength(2);
    });
  });
});
