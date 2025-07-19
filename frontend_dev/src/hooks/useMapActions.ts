// hooks/useMapActions.ts
import { useMap } from "../contexts/MapContext";
import { useGroup } from "../contexts/GroupContext";
import {
  createMap,
  createGroupMap,
  getMapList,
  getGroupMapList,
  deleteMap,
} from "../services/mapService";
import { checkSharedMap } from "../api/sharedMap";
import { registerSharedMap as registerSharedMapApi } from "../services/mapService";
import { MapItem } from "../types/map";
import { toast } from "react-hot-toast";
import ReactGA from "react-ga4";


export const useMapActions = () => {
  const { setMapList, setSelectedMap } = useMap();
  const { selectedGroup } = useGroup();

  const createNewMap = async (mapName: string, onClose: () => void) => {
    try {
      if (!mapName.trim()) {
        toast.error("マップ名を入力してください");
        return;
      }

      if (selectedGroup) {
        await createGroupMap({ name: mapName, groupUuid: selectedGroup.uuid });
        const maps = await getGroupMapList(selectedGroup.uuid);
        setMapList(maps);
      } else {
        await createMap({ name: mapName });
        const maps = await getMapList();
        setMapList(maps);

        ReactGA.gtag("event", "map_create", {
          map_name: mapName,
        });
      }

      toast.success("マップが作成されました");
      onClose();
    } catch (error) {
      toast.error("マップ作成に失敗しました");
    }
  };

  /** Map選択処理 */
  const selectMap = (map: MapItem, onSelect: (map: MapItem) => void, onClose: () => void) => {
    onSelect(map);                  // 状態を親に通知
    toast.success(`マップ「${map.name}」を選択しました`);
    onClose();
  };

  const deleteMapById = async (mapId: number, mapName: string) => {
    try {
      await deleteMap(mapId);
      const maps = selectedGroup
        ? await getGroupMapList(selectedGroup.uuid)
        : await getMapList();
      setMapList(maps);
      setSelectedMap(null);
      toast.success(`マップ「${mapName}」を削除しました`);
    } catch (error) {
      toast.error("マップの削除に失敗しました");
    }
  };

  const checkShareStatus = async (mapId: number) => {
    try {
      const result = await checkSharedMap(mapId);
      if (result) {
        return `https://your-domain.com/shared-map/${result.share_uuid}`;
      }
      return "";
    } catch {
      toast.error("シェア状態の確認に失敗しました");
      return null;
    }
  };

  /** シェアマップ登録処理 */
  const registerSharedMap = async (shareUuid: string | null) => {
    if (!shareUuid) {
      toast.error("シェアマップのUUIDがありません");
      return;
    }

    try {
      await registerSharedMapApi(shareUuid);
      console.log("シェアマップ登録成功");
      toast.success("シェアマップが登録されました");
    } catch (error) {
      console.error("シェアマップ登録エラー:", error);
      toast.error("シェアマップ登録に失敗しました");
    }
  };

  return {
    createNewMap,
    selectMap,
    deleteMapById,
    checkShareStatus,
    registerSharedMap,
  };
};
