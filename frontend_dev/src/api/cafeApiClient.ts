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
    console.log("📡 カフェ一覧取得:", response.data);

    return response.data.cafes.map((cafe: any) => this.transformCafe(cafe));
  }

  static async addCafeToMyCafe(mapId: number, cafe: Cafe): Promise<void> {
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

  static async fetchCafeDetailsByPlaceIds(placeIds: string[]): Promise<Cafe[]> {
    const csrfToken = await getCsrfToken();
    const promises = placeIds.map(async (placeId, index) => {
      const res = await axios.get(`${API_BASE_PATH}/fetch-cafe-detail/?place_id=${placeId}`, {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      });
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
    });

    return await Promise.all(promises);
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
}