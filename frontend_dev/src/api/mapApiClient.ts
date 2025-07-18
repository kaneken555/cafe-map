// src/api/mapApiClient.ts
import axios from "axios";
import { getCsrfToken } from "./auth";
import { API_BASE_PATH } from "../constants/api";

export interface CreateMapRequest {
  name: string;
}

export interface CreateGroupMapRequest {
  name: string;
  groupUuid: string;
}

export class MapApiClient {
  static async createMap(params: CreateMapRequest): Promise<any> {
    const csrfToken = await getCsrfToken();
    const response = await axios.post(
      `${API_BASE_PATH}/maps/`,
      { name: params.name },
      {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      }
    );
    return response.data;
  }

  static async createGroupMap(params: CreateGroupMapRequest): Promise<any> {
    const csrfToken = await getCsrfToken();
    const response = await axios.post(
      `${API_BASE_PATH}/groups/${params.groupUuid}/maps/`,
      { name: params.name },
      {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      }
    );
    return response.data;
  }

  static async getMapList(): Promise<any> {
    const response = await axios.get(`${API_BASE_PATH}/maps/`, {
      withCredentials: true,
    });
    return response.data;
  }

  static async getGroupMapList(groupUuid: string): Promise<any> {
    const response = await axios.get(`${API_BASE_PATH}/groups/${groupUuid}/maps/`, {
      withCredentials: true,
    });
    return response.data;
  }

  static async getSharedMapList(): Promise<any> {
    const response = await axios.get(`${API_BASE_PATH}/shared_maps/`, {
      withCredentials: true,
    });
    return response.data;
  }

  static async deleteMap(mapId: number): Promise<any> {
    const csrfToken = await getCsrfToken();
    const response = await axios.delete(`${API_BASE_PATH}/maps/${mapId}/`, {
      headers: { "X-CSRFToken": csrfToken },
      withCredentials: true,
    });
    return response.data;
  }

  static async registerSharedMap(uuid: string): Promise<any> {
    const csrfToken = await getCsrfToken();
    const response = await axios.post(
      `${API_BASE_PATH}/shared-maps/${uuid}/register/`,
      {},
      {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      }
    );
    return response.data;
  }

  static async copySharedMap(uuid: string, name: string): Promise<any> {
    const csrfToken = await getCsrfToken();
    const response = await axios.post(
      `${API_BASE_PATH}/shared-maps/${uuid}/copy/`,
      { name },
      {
        headers: { "X-CSRFToken": csrfToken },
        withCredentials: true,
      }
    );
    return response.data;
  }
}
