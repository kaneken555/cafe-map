// hooks/useHeaderActions.ts
import { useAuth } from "../contexts/AuthContext";
import { useMap } from "../contexts/MapContext";
import { useCafe } from "../contexts/CafeContext";
import { useGroup } from "../contexts/GroupContext";
import { getCafeList, getSharedMapCafeList } from "../services/cafeService";
import { guestLogin, logout } from "../services/authService";
import { getMapList, getSharedMapList } from "../services/mapService";
import { fetchGroupList } from "../services/groupService";
import { toast } from "react-hot-toast";
import { MapItem, SharedMapItem } from "../types/map";
import { MAP_MODES } from "../constants/map";


interface UseHeaderActionsParams {
  closeCafeListPanel: () => void;
  setShareUuid: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useHeaderActions = ({ closeCafeListPanel }: UseHeaderActionsParams) => {

  const { setUser, resetAuthContext } = useAuth();
  const { setMapList, setSelectedMap, setSharedMapList, setMapMode } = useMap();
  const { setCafeList, setMyCafeList } = useCafe();
  const { setGroupList, resetGroupContext } = useGroup();


  const guestLoginHandler = async () => {
    const userData = await guestLogin();
    if (!userData) {
      toast.error("ゲストログインに失敗しました");
      return;
    }
    setUser({ id: userData.id, name: userData.name }); // 👈 サーバーが返してきた本物のゲストユーザー情報をセット
    toast.success("ゲストログインしました");
    console.log("ゲストユーザー情報:", userData);

    // ログイン時にマップを取得する
    const maps = await getMapList();
    setMapList(maps);
    // 共有マップ一覧も取得
    const sharedMaps = await getSharedMapList()
    setSharedMapList(sharedMaps);

    // ✅ グループ一覧も取得
    const groups = await fetchGroupList();
    setGroupList(groups);

  }


  const logoutHandler = async () => {
    await logout();
    resetAuthContext();
    resetGroupContext();
    setSelectedMap(null);
    closeCafeListPanel();
    setCafeList([]);
    setMyCafeList([]);
    setMapMode(MAP_MODES.search);
  };


  const mapSelectHandler = async (map: MapItem) => {
    setSelectedMap(map);
    const cafes = await getCafeList(map.id);
    setCafeList(cafes);
    setMyCafeList(cafes);
  };

  const sharedMapSelectHandler = async (map: SharedMapItem) => {
    setSelectedMap(map);
    const cafes = await getSharedMapCafeList(map.uuid);
    setCafeList(cafes);
    setMyCafeList(cafes);
  };


  return {
    guestLoginHandler,
    logoutHandler,
    mapSelectHandler,
    sharedMapSelectHandler,

  };
};
