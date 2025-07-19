// src/api/mapService.ts
import { MapApiClient, CreateMapRequest, CreateGroupMapRequest } from "../api/mapApiClient";


export const createMap = async (params: CreateMapRequest): Promise<void> => {
  return await MapApiClient.createMap(params);
}

export const createGroupMap = async (params: CreateGroupMapRequest): Promise<void> => {
  return await MapApiClient.createGroupMap(params);
};

export const getMapList = async (): Promise<any> => {
  return await MapApiClient.getMapList();
};

export const getGroupMapList = async (groupUuid: string): Promise<any> => {
  return await MapApiClient.getGroupMapList(groupUuid);
};

export const getSharedMapList = async (): Promise<any> => {
  return await MapApiClient.getSharedMapList();
}

export const deleteMap = async (mapId: number): Promise<void> => {
  return await MapApiClient.deleteMap(mapId);
}

export const registerSharedMap = async (uuid: string): Promise<void> => {
  return await MapApiClient.registerSharedMap(uuid);
}

export const copySharedMap = async (uuid: string, name: string): Promise<void> => {
  return await MapApiClient.copySharedMap(uuid, name);
};
