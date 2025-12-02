/**
 * 統合ポイント型とガード関数のテスト
 */
import { describe, it, expect } from 'vitest';
import { isCafePoint, isCustomPlacePoint, CafePoint, CustomPlacePoint } from './point';

describe('point type guards', () => {
  describe('isCafePoint', () => {
    it('カフェポイントの場合はtrueを返す', () => {
      const cafePoint: CafePoint = {
        type: 'cafe',
        id: 1,
        name: 'Test Cafe',
        latitude: 35.6590,
        longitude: 139.7004,
        image_url: null,
      };

      expect(isCafePoint(cafePoint)).toBe(true);
    });

    it('カスタム地点ポイントの場合はfalseを返す', () => {
      const customPlacePoint: CustomPlacePoint = {
        type: 'custom_place',
        id: 5,
        name: 'Tokyo Tower',
        latitude: 35.6890,
        longitude: 139.7020,
        image_url: null,
      };

      expect(isCafePoint(customPlacePoint)).toBe(false);
    });

    it('型ガードが正しく型を絞り込む', () => {
      const cafePoint: CafePoint = {
        type: 'cafe',
        id: 1,
        name: 'Test Cafe',
        latitude: 35.6590,
        longitude: 139.7004,
        image_url: null,
        place_id: 'test_place_id', // カフェ固有フィールド
        rating: 4.5,
      };

      if (isCafePoint(cafePoint)) {
        // この中ではCafePoint型として扱われる
        expect(cafePoint.place_id).toBe('test_place_id');
        expect(cafePoint.rating).toBe(4.5);
      }
    });
  });

  describe('isCustomPlacePoint', () => {
    it('カスタム地点ポイントの場合はtrueを返す', () => {
      const customPlacePoint: CustomPlacePoint = {
        type: 'custom_place',
        id: 5,
        name: 'Tokyo Tower',
        latitude: 35.6890,
        longitude: 139.7020,
        image_url: null,
      };

      expect(isCustomPlacePoint(customPlacePoint)).toBe(true);
    });

    it('カフェポイントの場合はfalseを返す', () => {
      const cafePoint: CafePoint = {
        type: 'cafe',
        id: 1,
        name: 'Test Cafe',
        latitude: 35.6590,
        longitude: 139.7004,
        image_url: null,
      };

      expect(isCustomPlacePoint(cafePoint)).toBe(false);
    });

    it('型ガードが正しく型を絞り込む', () => {
      const customPlacePoint: CustomPlacePoint = {
        type: 'custom_place',
        id: 5,
        name: 'Tokyo Tower',
        latitude: 35.6890,
        longitude: 139.7020,
        image_url: null,
        owner: { id: 1, name: 'guest' }, // カスタム地点固有フィールド
        place_type: 'photo_spot',
        memo: '絶景ポイント',
      };

      if (isCustomPlacePoint(customPlacePoint)) {
        // この中ではCustomPlacePoint型として扱われる
        expect(customPlacePoint.owner).toEqual({ id: 1, name: 'guest' });
        expect(customPlacePoint.place_type).toBe('photo_spot');
        expect(customPlacePoint.memo).toBe('絶景ポイント');
      }
    });
  });

  describe('型ガードの相互排他性', () => {
    it('isCafePointとisCustomPlacePointは相互排他的', () => {
      const cafePoint: CafePoint = {
        type: 'cafe',
        id: 1,
        name: 'Test Cafe',
        latitude: 35.6590,
        longitude: 139.7004,
        image_url: null,
      };

      const customPlacePoint: CustomPlacePoint = {
        type: 'custom_place',
        id: 5,
        name: 'Tokyo Tower',
        latitude: 35.6890,
        longitude: 139.7020,
        image_url: null,
      };

      // カフェポイントはカスタム地点ポイントではない
      expect(isCafePoint(cafePoint)).toBe(true);
      expect(isCustomPlacePoint(cafePoint)).toBe(false);

      // カスタム地点ポイントはカフェポイントではない
      expect(isCustomPlacePoint(customPlacePoint)).toBe(true);
      expect(isCafePoint(customPlacePoint)).toBe(false);
    });
  });
});
