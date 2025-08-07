// src/api/cafeService.ts
import { Cafe } from "../types/cafe";
import { toast } from "react-hot-toast";
import { CafeApiClient } from "../api/cafeApiClient";


// マップに登録されているカフェの情報を取得する
export const getCafeList = async (mapId: number): Promise<Cafe[]> => {
  return await CafeApiClient.getCafeList(mapId);
};


// POSTリクエスト関数
export const addCafeToMyCafe = async (mapId: number ,cafe: Cafe
): Promise<{ id: number; name: string; already_existed: boolean }> => {
  const response = await CafeApiClient.addCafeToMyCafe(mapId, cafe);
  toast.success("カフェがマイカフェに追加されました");
  return response;
};


// 🔍 緯度・経度から周辺のカフェplace_idを取得し、詳細情報を取得して返す
export const searchCafe = async (lat: number, lng: number): Promise<Cafe[]> => {
  return await CafeApiClient.searchCafe(lat, lng);
};


// 🔍 キーワード・緯度・経度から周辺のカフェplace_idを取得し、詳細情報を取得して返す
export const searchCafeByKeyword = async (
  keyword: string,
  lat: number,
  lng: number
): Promise<Cafe[]> => {
  return await CafeApiClient.searchCafeByKeyword(keyword, lat, lng);
};


export const searchSharedMap = async (groupUuid: string): Promise<Cafe[]> => {
  return await CafeApiClient.searchSharedMap(groupUuid);
}


// シェアマップに登録されているカフェの情報を取得する
export const getSharedMapCafeList = async (mapUuid: string): Promise<Cafe[]> => {
  return await CafeApiClient.getSharedMapCafeList(mapUuid);
};

// マップからカフェを削除する
export const removeCafeFromMap = async (mapId: number, cafeId: number): Promise<void> => {
  await CafeApiClient.removeCafeFromMap(mapId, cafeId);
  toast.success("カフェがマップから削除されました");
};
