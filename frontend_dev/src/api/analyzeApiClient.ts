// src/api/analyzeApiClient.ts
import axios from "axios";
import { getCsrfToken } from "../services/authService";
import { API_BASE_PATH } from "../constants/api";
import {
  ShareChannel,
  MapAnalyzeData,
  CreateAnalyzeLinkRequest,
  CreateAnalyzeLinkResponse,
  UpdateAnalyzeLinkLabelRequest,
  UpdateAnalyzeLinkLabelResponse,
} from "../types/analyze";

export class AnalyzeApiClient {
  /**
   * 共有先マスタ一覧を取得
   */
  static async getShareChannels(): Promise<ShareChannel[]> {
    const response = await axios.get(`${API_BASE_PATH}/share-channels/`, {
      withCredentials: true,
    });
    return response.data;
  }

  /**
   * 指定マップのアナライズ情報を取得
   */
  static async getMapAnalyzeData(mapId: number): Promise<MapAnalyzeData> {
    const response = await axios.get(
      `${API_BASE_PATH}/maps/${mapId}/analyze/`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }

  /**
   * シェアリンクを作成または取得
   */
  static async createOrGetAnalyzeLink(
    mapId: number,
    params: CreateAnalyzeLinkRequest
  ): Promise<CreateAnalyzeLinkResponse> {
    const csrfToken = await getCsrfToken();
    const response = await axios.post(
      `${API_BASE_PATH}/maps/${mapId}/analyze/links/`,
      params,
      {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      }
    );
    return response.data;
  }

  /**
   * シェアリンクのcustom_labelを更新
   */
  static async updateAnalyzeLinkLabel(
    linkId: number,
    params: UpdateAnalyzeLinkLabelRequest
  ): Promise<UpdateAnalyzeLinkLabelResponse> {
    const csrfToken = await getCsrfToken();
    const response = await axios.patch(
      `${API_BASE_PATH}/analyze/links/${linkId}/`,
      params,
      {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      }
    );
    return response.data;
  }
}
