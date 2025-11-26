// src/api/cafeApiClient.ts
import axios from "axios";
import { getCsrfToken } from "../services/authService";
import { API_BASE_PATH } from "../constants/api";
import { Cafe } from "../types/cafe";


export class CafeApiClient {
  static async getCafeList(mapId: number): Promise<Cafe[]> {
    const csrfToken = await getCsrfToken();
    const response = await axios.get(`${API_BASE_PATH}/maps/${mapId}/`, {
      headers: { "X-CSRFToken": csrfToken },
      withCredentials: true,
    });
    return response.data.cafes.map((cafe: any) => this.transformCafe(cafe));
  }

  static async addCafeToMyCafe(mapId: number, cafe: Cafe
  ): Promise<{ id: number; name: string; already_existed: boolean }> {
    const csrfToken = await getCsrfToken();
    const response = await axios.post(
      `${API_BASE_PATH}/maps/${mapId}/cafes/`,
      cafe,
      {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      }
    );
    return response.data;
  }

  static async searchCafe(lat: number, lng: number): Promise<Cafe[]> {
    const csrfToken = await getCsrfToken();
    const res = await axios.get(`${API_BASE_PATH}/fetch-cafes/?lat=${lat}&lng=${lng}`, {
      headers: { "X-CSRFToken": csrfToken },
      withCredentials: true,
    });

    const placeIds = res.data.cafes.map((c: any) => c.place_id);
    return await this.fetchCafeDetailsByPlaceIds(placeIds);
  }

  static async searchCafeByKeyword(keyword: string, lat: number, lng: number): Promise<Cafe[]> {
    const csrfToken = await getCsrfToken();
    const res = await axios.get(
      `${API_BASE_PATH}/fetch-cafes/keyword/?q=${encodeURIComponent(keyword)}&lat=${lat}&lng=${lng}`,
      {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      }
    );

    const placeIds = res.data.cafes.map((c: any) => c.place_id);
    return await this.fetchCafeDetailsByPlaceIds(placeIds);
  }

  /**
   * 複数のplace_idに対してバッチで詳細情報を取得
   *
   * @param placeIds - place_idの配列
   * @returns カフェ詳細情報の配列
   */
  static async fetchCafeDetailsByPlaceIds(placeIds: string[]): Promise<Cafe[]> {
    // 空の場合は空配列を返す
    if (placeIds.length === 0) {
      return [];
    }

    const csrfToken = await getCsrfToken();

    try {
      // バッチAPIを使用して一度にすべての詳細情報を取得
      const response = await axios.post(
        `${API_BASE_PATH}/fetch-cafes-details-batch/`,
        { place_ids: placeIds },
        {
          headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // レスポンスを変換
      const cafes = response.data.cafes.map((detail: any, index: number) => ({
        id: index + 1,
        placeId: detail.place_id,
        name: detail.name,
        address: detail.address,
        openTime: (detail.opening_hours ?? []).join(", "),
        status: detail.opening_hours?.length > 0 ? "現在営業中" : "営業時間外",
        distance: "",
        price_day: "",
        price_night: "",
        priceLevel: detail.price_level ?? 0,
        rating: detail.rating ?? 0,
        userRatingTotal: detail.user_ratings_total ?? 0,
        photoUrls: detail.photos ?? [],
        phoneNumber: detail.phone_number ?? "",
        website: detail.website ?? "",
        lat: detail.latitude,
        lng: detail.longitude,
        businessStatus: detail.business_status ?? "",
      } as Cafe));

      // 一部のplace_idが失敗した場合の警告
      if (cafes.length < placeIds.length) {
        console.warn(
          `一部のカフェ情報の取得に失敗しました。` +
          `リクエスト: ${placeIds.length}件, 取得成功: ${cafes.length}件`
        );
      }

      return cafes;
    } catch (error) {
      console.error("Failed to fetch cafe details batch:", error);

      // バッチAPIが失敗した場合は、従来の方法（個別取得）にフォールバック
      console.warn("バッチAPIが失敗したため、個別取得にフォールバックします");
      return await this.fetchCafeDetailsByPlaceIdsLegacy(placeIds);
    }
  }

  /**
   * レガシー実装: 個別にカフェ詳細を取得（フォールバック用）
   *
   * @param placeIds - place_idの配列
   * @returns カフェ詳細情報の配列
   */
  private static async fetchCafeDetailsByPlaceIdsLegacy(placeIds: string[]): Promise<Cafe[]> {
    const csrfToken = await getCsrfToken();
    const promises = placeIds.map(async (placeId, index) => {
      try {
        const res = await axios.get(
          `${API_BASE_PATH}/fetch-cafe-detail/?place_id=${placeId}`,
          {
            headers: { "X-CSRFToken": csrfToken },
            withCredentials: true,
          }
        );
        const detail = res.data;
        return {
          id: index + 1,
          placeId: detail.place_id,
          name: detail.name,
          address: detail.address,
          openTime: (detail.opening_hours ?? []).join(", "),
          status: detail.opening_hours?.length > 0 ? "現在営業中" : "営業時間外",
          distance: "",
          price_day: "",
          price_night: "",
          priceLevel: detail.price_level ?? 0,
          rating: detail.rating ?? 0,
          userRatingTotal: detail.user_ratings_total ?? 0,
          photoUrls: detail.photos ?? [],
          phoneNumber: detail.phone_number ?? "",
          website: detail.website ?? "",
          lat: detail.latitude,
          lng: detail.longitude,
          businessStatus: detail.business_status ?? "",
        } as Cafe;
      } catch (error) {
        console.error(`Failed to fetch details for place_id=${placeId}:`, error);
        return null;
      }
    });

    const results = await Promise.all(promises);
    return results.filter((cafe): cafe is Cafe => cafe !== null);
  }

  static async searchSharedMap(groupUuid: string): Promise<Cafe[]> {
    const csrfToken = await getCsrfToken();
    const response = await axios.get(`${API_BASE_PATH}/shared-maps/${groupUuid}/`, {
      headers: { "X-CSRFToken": csrfToken },
      withCredentials: true,
    });

    return response.data.cafes.map((cafe: any) => this.transformCafe(cafe));
  }

  static async getSharedMapCafeList(mapUuid: string): Promise<Cafe[]> {
    const csrfToken = await getCsrfToken();
    const response = await axios.get(`${API_BASE_PATH}/shared-maps/${mapUuid}/`, {
      headers: { "X-CSRFToken": csrfToken },
      withCredentials: true,
    });

    return response.data.cafes.map((cafe: any) => this.transformCafe(cafe));
  }


  private static transformCafe(cafe: any): Cafe {
    return {
      id: cafe.id,
      placeId: cafe.place_id,
      name: cafe.name,
      lat: cafe.latitude,
      lng: cafe.longitude,
      photoUrls: cafe.photo_urls,
      address: cafe.address,
      rating: cafe.rating,
      phoneNumber: cafe.phone_number,
      openTime: cafe.opening_hours,
      status: cafe.business_status || "OPERATIONAL",
      distance: cafe.distance || "0 km",
      website: cafe.website,
      priceLevel: cafe.price_level,
    };
  }

  static async removeCafeFromMap(mapId: number, cafeId: number): Promise<void> {
    const csrfToken = await getCsrfToken();
    await axios.delete(`${API_BASE_PATH}/maps/${mapId}/cafes/${cafeId}/`, {
      headers: { "X-CSRFToken": csrfToken },
      withCredentials: true,
    });
  }
}