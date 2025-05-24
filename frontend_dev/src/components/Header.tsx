// components/Header.tsx
import React, { useState } from "react";
import SideMenu from "./SideMenu";
import MapListModal from "./MapListModal";
import HeaderButton from "./HeaderButton";
import UserMenu from "./UserMenu";
import GroupListModal from "./GroupListModal";
import { Coffee, Map as MapIcon, List as ListIcon, Layers, Menu } from "lucide-react";
import { getCafeList } from "../api/cafe";
import { guestLogin, logout } from "../api/auth";
import { getMapList, getSharedMapList } from "../api/map";
import { fetchGroupList } from "../api/group";
import { toast } from "react-hot-toast";
import { MapItem, SharedMapItem, MapMode } from "../types/map";
import { User as UserType } from "../types/user";
import { Cafe } from "../types/cafe";
import { Group } from "../types/group";
import { ICON_SIZES } from "../constants/ui";


interface HeaderProps {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  selectedMap: MapItem | null;
  setSelectedMap: (map: MapItem | null) => void;
  cafeList: Cafe[];
  setCafeList: (cafes: Cafe[]) => void;
  openCafeListPanel: () => void;
  closeCafeListPanel: () => void;
  setMyCafeList: (cafes: Cafe[]) => void;   
  mapMode: MapMode;
  setMapMode: (mode: MapMode) => void; 
  isMyCafeListOpen: boolean;
  sharedMapCafeList: Cafe[]; // ✅ シェアマップのカフェリスト
  setSharedMapCafeList: React.Dispatch<React.SetStateAction<Cafe[]>>; // ✅ シェアマップのカフェリストをセットする関数
  setShareUuid: React.Dispatch<React.SetStateAction<string | null>>; // ✅ シェアマップのUUIDをセットする関数
}

const Header: React.FC<HeaderProps> = ({
  user,
  setUser,
  selectedMap,
  setSelectedMap,
  cafeList,
  setCafeList,
  openCafeListPanel,
  closeCafeListPanel,
  setMyCafeList,
  mapMode,
  setMapMode, 
  isMyCafeListOpen,
  sharedMapCafeList, // ✅ シェアマップのカフェリスト
  setSharedMapCafeList, // ✅ シェアマップのカフェリストをセットする関数
  setShareUuid, // ✅ シェアマップのUUIDをセットする関数

}) => {    
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isMapListOpen, setIsMapListOpen] = useState(false);
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);
  const [mapList, setMapList] = useState<MapItem[]>([]);
  const [sharedMapList, setSharedMapList] = useState<SharedMapItem[]>([]);
  const [isGroupListOpen, setIsGroupListOpen] = useState(false); // 👈 グループ一覧モーダル
  const [groupList, setGroupList] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);

  
  const requireMapSelected = (action: () => void) => {
    if (!selectedMap) {
      toast.error("マップを選択してください");
      return;
    }
    action();
  };

  const handleOpenCafeList = () =>
    requireMapSelected(openCafeListPanel);

  const handleShowMyCafeMap = () =>
    requireMapSelected(() => setMapMode("mycafe"));

  const handleOpenMapList = () => {
    setIsMapListOpen(true);
  }

  const handleGuestLogin = async () => {
    // フロントエンドのみの仮実装
    //   setUser({ id: 1, name: "ゲストユーザー" });
    //   setIsLoginMenuOpen(false);
    //   guestLogin();

    const userData = await guestLogin();
    if (userData) {
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

    } else {
      toast.error("ゲストログインに失敗しました");
    }
    setIsLoginMenuOpen(false);
  }

  const handleLogout = async () => {
    await logout();
    setUser(null);              // ✅ ログアウト（ユーザー消す）
    setSelectedMap(null);       // ✅ 選択中マップもリセット
    setSelectedGroup(null);     // ✅ 選択中グループもリセット
    setSelectedGroupId(null);   // ✅ 選択中グループIDもリセット
    closeCafeListPanel();       // カフェ一覧パネルを閉じる
    setCafeList([]);            // ✅ カフェリストもリセット（オプション）
    setMapMode("search");       // ✅ マップモードもリセット（オプション）
    setIsLoginMenuOpen(false);  // メニューを閉じる
    // toast.success("ログアウトしました");
  }

  const handleMapSelect = async (map: MapItem) => {
    setSelectedMap(map);
    setIsMapListOpen(false);

    const cafes = await getCafeList(map.id);  // ✅ マップ選択と同時にカフェ取得
    setCafeList(cafes);
    setMyCafeList(cafes); // 地図用にも保存（もし必要なら）
  }


  return (
    <>
      <SideMenu 
        isOpen={isSideMenuOpen} 
        onClose={() => setIsSideMenuOpen(false)} 
      />
      <MapListModal
          isOpen={isMapListOpen}
          onClose={() => setIsMapListOpen(false)}
          onSelectMap={handleMapSelect}
          selectedMapId={selectedMap?.id ?? null} 
          mapList={mapList} 
          sharedMapList={sharedMapList}
          setMapList={setMapList}
          user={user} 
          setSelectedMap={setSelectedMap}
          selectedGroup={selectedGroup}
          sharedMapCafeList={sharedMapCafeList} // ✅ シェアマップのカフェリスト
          setSharedMapCafeList={setSharedMapCafeList} // ✅ シェアマップのカフェリストをセットする関数
          setMapMode={setMapMode} // ✅ マップモードをセットする関数
          setShareUuid={setShareUuid} // ✅ シェアマップのUUIDをセットする関数
        />
        
      <header className="w-full h-16 px-4 flex justify-between items-center bg-gradient-to-r from-yellow-300 to-yellow-500 shadow-md">
        {/* 左：サイドメニュー */}
        <div className="flex items-center">
          <button onClick={() => setIsSideMenuOpen(true)} className="text-2xl cursor-pointer">
            <Menu size={ICON_SIZES.MEDIUM} />
          </button>
        </div>

        {/* 中央：タイトル */}
        <div className="flex-grow flex justify-center items-center space-x-2">
          <Coffee size={ICON_SIZES.MEDIUM} />
          <h1 className="text-2xl font-bold text-black">Café Map</h1>
        </div>

        {/* 右：操作ボタン群 */}
        <div className="flex items-center space-x-2">
          <HeaderButton
            onClick={handleOpenCafeList}
            disabled={!user}
            icon={<ListIcon size={ICON_SIZES.MEDIUM} />}
            label="My Café List"
            active={isMyCafeListOpen}
          />

          <HeaderButton
            onClick={handleShowMyCafeMap}
            disabled={!user}
            icon={<MapIcon size={ICON_SIZES.MEDIUM} />}
            label="My Café Map"
            active={mapMode === "mycafe"} // ✅ 現在のモードによって強調
          />

          <HeaderButton
            onClick={handleOpenMapList}
            disabled={!user}
            icon={<Layers size={ICON_SIZES.MEDIUM} />}
            label={selectedMap?.name || "My Map List"}
            active={!!selectedMap} // ✅ 現在のマップによって強調
          />

          <UserMenu
            user={user}
            setUser={setUser}
            setMapList={setMapList}
            setGroupList={setGroupList}
            isOpen={isLoginMenuOpen}
            onToggle={() => setIsLoginMenuOpen((prev) => !prev)}
            onGuestLogin={handleGuestLogin}
            onLogout={handleLogout}
            onOpenGroupList={() => {
              setIsGroupListOpen(true);
              setIsLoginMenuOpen(false); // 👈 メニューを閉じてからモーダルを開く
            }}
          />

          <GroupListModal
            isOpen={isGroupListOpen}
            onClose={() => setIsGroupListOpen(false)}
            groupList={groupList}
            setGroupList={setGroupList}
            onSelectGroup={(group) => {
              setSelectedGroup(group);
              setSelectedGroupId(group?.id ?? null); // ✅ IDも更新
              setIsGroupListOpen(false);
            }}
            setMapList={setMapList}
            selectedGroupId={selectedGroupId}
            setSelectedGroupId={setSelectedGroupId}
          />
        </div>
      </header>
    </>
  );
}
export default Header;