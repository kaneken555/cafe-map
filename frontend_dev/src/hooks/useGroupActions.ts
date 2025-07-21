// hooks/useGroupActions.ts
import { useGroup } from "../contexts/GroupContext";
import { useMap } from "../contexts/MapContext";
import { fetchGroupList, joinGroup } from "../services/groupService";
import { getGroupMapList, getMapList } from "../services/mapService";
import { toast } from "react-hot-toast";
import { MAP_MODES } from "../constants/map";
import { Group } from "../types/group";

export const useGroupActions = (
  onSelectGroup: (group: Group | null) => void
) => {
  const { setGroupList, setSelectedGroupId } = useGroup();
  const { setMapList, setSelectedMap, setSharedMapList, setMapMode } = useMap();

  const handleGroupSelect = async (group: Group) => {
    try {
      setSelectedGroupId(group.id);
      onSelectGroup(group);

      const maps = await getGroupMapList(group.uuid);
      setMapList(maps);
      toast.success(`グループ「${group.name}」を選択しました`);

      setSharedMapList([]);
      setSelectedMap(null);
      setMapMode(MAP_MODES.search);
    } catch (error) {
      toast.error("グループのマップ取得に失敗しました");
    }
  };

  const handleGroupClear = async () => {
    setSelectedGroupId(null);
    onSelectGroup(null);
    setSelectedMap(null);
    try {
      const maps = await getMapList();
      setMapList(maps);
      toast.success("グループ選択を解除しました");
    } catch (error) {
      toast.error("マップ一覧の取得に失敗しました");
    }
  };

  const handleGroupJoin = async (uuid: string, onSuccess: () => void) => {
    try {
      await joinGroup(uuid);
      const updatedGroups = await fetchGroupList();
      setGroupList(updatedGroups);
      toast.success("グループに参加しました");
      onSuccess();
    } catch (error) {
      toast.error("グループ参加に失敗しました");
    }
  };

  return {
    handleGroupSelect,
    handleGroupClear,
    handleGroupJoin,
  };
};
