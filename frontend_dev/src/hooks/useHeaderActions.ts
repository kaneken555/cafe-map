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
import { CustomPlace } from "../types/customPlace";
import { FEATURES } from "../config/features";
import { fetchMapPoints } from "../api/points";
import { separatePoints } from "../utils/pointConverters";


interface UseHeaderActionsParams {
  closeCafeListPanel: () => void;
  setShareUuid: React.Dispatch<React.SetStateAction<string | null>>;
  setCustomPlaces?: React.Dispatch<React.SetStateAction<CustomPlace[]>>;
}

export const useHeaderActions = ({ closeCafeListPanel, setCustomPlaces }: UseHeaderActionsParams) => {

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

    // フィーチャーフラグで統合APIを使用するか判定
    if (FEATURES.USE_UNIFIED_POINTS_API) {
      // 統合API使用: 1回のAPIコールでカフェとカスタム地点を取得
      try {
        const response = await fetchMapPoints(map.id);
        const { cafes, customPlaces } = separatePoints(response.points);

        setCafeList(cafes);
        setMyCafeList(cafes);

        // カスタム地点も同時に更新
        if (setCustomPlaces) {
          setCustomPlaces(customPlaces);
        }
      } catch (error) {
        console.error("統合API呼び出しに失敗しました:", error);
        toast.error("データの取得に失敗しました");
      }
    } else {
      // 既存API使用: カフェのみ取得（カスタム地点は別途取得）
      const cafes = await getCafeList(map.id);
      setCafeList(cafes);
      setMyCafeList(cafes);
    }
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
