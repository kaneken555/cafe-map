import { CustomPlaceApiClient } from "../api/customPlaceApiClient";
import {
  CustomPlace,
  CreateCustomPlaceRequest,
  UpdateCustomPlaceRequest,
  CustomPlaceListResponse,
  CustomPlacesByMapResponse,
  CustomPlaceMapRelation,
} from "../types/customPlace";

/**
 * カスタム地点を作成
 */
export const createCustomPlace = async (
  data: CreateCustomPlaceRequest
): Promise<CustomPlace> => {
  return await CustomPlaceApiClient.createCustomPlace(data);
};

/**
 * カスタム地点一覧を取得
 */
export const getCustomPlaces = async (): Promise<CustomPlaceListResponse> => {
  return await CustomPlaceApiClient.getCustomPlaces();
};

/**
 * カスタム地点詳細を取得
 */
export const getCustomPlace = async (id: number): Promise<CustomPlace> => {
  return await CustomPlaceApiClient.getCustomPlace(id);
};

/**
 * カスタム地点を更新
 */
export const updateCustomPlace = async (
  id: number,
  data: UpdateCustomPlaceRequest
): Promise<CustomPlace> => {
  return await CustomPlaceApiClient.updateCustomPlace(id, data);
};

/**
 * カスタム地点を削除
 */
export const deleteCustomPlace = async (id: number): Promise<void> => {
  return await CustomPlaceApiClient.deleteCustomPlace(id);
};

/**
 * マップ内のカスタム地点を取得
 */
export const getCustomPlacesByMap = async (
  mapId: number
): Promise<CustomPlacesByMapResponse> => {
  return await CustomPlaceApiClient.getCustomPlacesByMap(mapId);
};

/**
 * マップにカスタム地点を関連付け
 */
export const addCustomPlaceToMap = async (
  mapId: number,
  customPlaceId: number
): Promise<CustomPlaceMapRelation> => {
  return await CustomPlaceApiClient.addCustomPlaceToMap(mapId, customPlaceId);
};

/**
 * マップからカスタム地点の関連を削除
 */
export const removeCustomPlaceFromMap = async (
  mapId: number,
  customPlaceId: number
): Promise<void> => {
  return await CustomPlaceApiClient.removeCustomPlaceFromMap(mapId, customPlaceId);
};
