import axios from "axios";
import { getCsrfToken } from "../services/authService";
import { API_BASE_PATH } from "../constants/api";
import {
  CustomPlace,
  CreateCustomPlaceRequest,
  UpdateCustomPlaceRequest,
  CustomPlaceListResponse,
  CustomPlacesByMapResponse,
  CustomPlaceMapRelation,
} from "../types/customPlace";

export class CustomPlaceApiClient {
  /**
   * カスタム地点を作成
   */
  static async createCustomPlace(
    data: CreateCustomPlaceRequest
  ): Promise<CustomPlace> {
    const csrfToken = await getCsrfToken();

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("latitude", data.latitude.toString());
    formData.append("longitude", data.longitude.toString());

    if (data.image) {
      formData.append("image", data.image);
    }
    if (data.place_type) {
      formData.append("place_type", data.place_type);
    }
    if (data.memo) {
      formData.append("memo", data.memo);
    }
    if (data.map_ids && data.map_ids.length > 0) {
      formData.append("map_ids", JSON.stringify(data.map_ids));
    }

    // デバッグ: FormDataの内容を確認
    console.log('送信するFormData:');
    for (const [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value);
    }

    const response = await axios.post<CustomPlace>(
      `${API_BASE_PATH}/custom-places/`,
      formData,
      {
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    return response.data;
  }

  /**
   * カスタム地点一覧を取得
   */
  static async getCustomPlaces(): Promise<CustomPlaceListResponse> {
    const response = await axios.get<CustomPlaceListResponse>(
      `${API_BASE_PATH}/custom-places/`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }

  /**
   * カスタム地点詳細を取得
   */
  static async getCustomPlace(id: number): Promise<CustomPlace> {
    const response = await axios.get<CustomPlace>(
      `${API_BASE_PATH}/custom-places/${id}/`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }

  /**
   * カスタム地点を更新
   */
  static async updateCustomPlace(
    id: number,
    data: UpdateCustomPlaceRequest
  ): Promise<CustomPlace> {
    const csrfToken = await getCsrfToken();

    const response = await axios.patch<CustomPlace>(
      `${API_BASE_PATH}/custom-places/${id}/`,
      data,
      {
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response.data;
  }

  /**
   * カスタム地点を削除
   */
  static async deleteCustomPlace(id: number): Promise<void> {
    const csrfToken = await getCsrfToken();

    await axios.delete(`${API_BASE_PATH}/custom-places/${id}/`, {
      headers: {
        "X-CSRFToken": csrfToken,
      },
      withCredentials: true,
    });
  }

  /**
   * マップ内のカスタム地点を取得
   */
  static async getCustomPlacesByMap(
    mapId: number
  ): Promise<CustomPlacesByMapResponse> {
    const response = await axios.get<CustomPlacesByMapResponse>(
      `${API_BASE_PATH}/custom-places/by-map/${mapId}/`,
      {
        withCredentials: true,
      }
    );

    return response.data;
  }

  /**
   * マップにカスタム地点を関連付け
   */
  static async addCustomPlaceToMap(
    mapId: number,
    customPlaceId: number
  ): Promise<CustomPlaceMapRelation> {
    const csrfToken = await getCsrfToken();

    const response = await axios.post<CustomPlaceMapRelation>(
      `${API_BASE_PATH}/custom-places/maps/${mapId}/add/`,
      { custom_place_id: customPlaceId },
      {
        headers: {
          "X-CSRFToken": csrfToken,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    return response.data;
  }

  /**
   * マップからカスタム地点の関連を削除
   */
  static async removeCustomPlaceFromMap(
    mapId: number,
    customPlaceId: number
  ): Promise<void> {
    const csrfToken = await getCsrfToken();

    await axios.delete(
      `${API_BASE_PATH}/custom-places/maps/${mapId}/remove/${customPlaceId}/`,
      {
        headers: {
          "X-CSRFToken": csrfToken,
        },
        withCredentials: true,
      }
    );
  }
}
