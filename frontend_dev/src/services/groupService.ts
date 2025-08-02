// src/api/groupService.ts
import { GroupApiClient } from "../api/groupApiClient";
import { toast } from "react-hot-toast";
import { Group } from "../types/group";


/**
 * ログイン中のユーザーが所属するグループ一覧を取得
 */
export const fetchGroupList = async (): Promise<Group[]> => {
  return await GroupApiClient.fetchGroupList();
};

/**
 * 新しいグループを作成
 */
export const createGroup = async (name: string, description = ""): Promise<Group> => {
  try {
    const group = await GroupApiClient.createGroup(name, description);
    toast.success("グループを作成しました");
    return group;
  } catch (error) {
    toast.error("グループ作成に失敗しました");
    throw error;
  }
};

/**
 * 招待URL経由でグループに参加
 */
export const joinGroup = async (groupUuid: string): Promise<void> => {
  try {
    await GroupApiClient.joinGroup(groupUuid);
    toast.success("グループに参加しました");
  } catch (error) {
    toast.error("グループ参加に失敗しました");
    throw error;
  }
};

/**
 * 指定されたグループに属するマップ一覧を取得
 */
export const fetchGroupMaps = async (groupUuid: number): Promise<{ id: number; name: string }[]> => {
  return await GroupApiClient.fetchGroupMaps(groupUuid);
};

/**
 * グループを削除
 */
export const deleteGroup = async (groupUuid: string): Promise<void> => {
  try {
    await GroupApiClient.deleteGroup(groupUuid);
    toast.success("グループを削除しました");
  } catch (error) {
    toast.error("グループ削除に失敗しました");
    throw error;
  }
};