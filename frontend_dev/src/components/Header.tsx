// components/Header.tsx
import React, { useState } from "react";
import SideMenu from "./SideMenu";
import MapListModal from "./MapListModal";
import HeaderButton from "./HeaderButton";
import UserMenu from "./UserMenu";
import GroupListModal from "./GroupListModal";
import { Coffee, Map as MapIcon, List as ListIcon, Layers, Menu } from "lucide-react";
import { toast } from "react-hot-toast";
import { MapItem, SharedMapItem } from "../types/map";
import { ICON_SIZES } from "../constants/ui";

// Contexts
import { useAuth } from "../contexts/AuthContext";
import { useMap } from "../contexts/MapContext";
import { useGroup } from "../contexts/GroupContext";

import { useHeaderActions } from "../hooks/useHeaderActions"; // ✅ ヘッダーアクションフックをインポート

interface HeaderProps {
  openCafeListPanel: () => void;
  closeCafeListPanel: () => void;
  isMyCafeListOpen: boolean;
  setShareUuid: React.Dispatch<React.SetStateAction<string | null>>; // ✅ シェアマップのUUIDをセットする関数
}

const Header: React.FC<HeaderProps> = ({
  openCafeListPanel,
  closeCafeListPanel,
  isMyCafeListOpen,
  setShareUuid, // ✅ シェアマップのUUIDをセットする関数
}) => {    
  const { user } = useAuth();
  const { selectedMap, mapMode, setMapMode } = useMap(); // マップリストとセット関数をコンテキストから取得
  const { setSelectedGroup, setSelectedGroupId } = useGroup(); // グループリストのセット関数をコンテキストから取得

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isMapListOpen, setIsMapListOpen] = useState(false);
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);
  const [isGroupListOpen, setIsGroupListOpen] = useState(false); // 👈 グループ一覧モーダル

  const {
    guestLoginHandler,
    logoutHandler,
    mapSelectHandler,
    sharedMapSelectHandler,
  } = useHeaderActions({ closeCafeListPanel, setShareUuid });
  
  
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
    await guestLoginHandler(); // ✅ ヘッダーアクションフックのゲストログインハンドラを呼び出す
    setIsLoginMenuOpen(false);
  }

  const handleLogout = async () => {
    await logoutHandler(); // ✅ ヘッダーアクションフックのログアウトハンドラを呼び出す
    setIsLoginMenuOpen(false);  // メニューを閉じる
  }

  const handleMapSelect = async (map: MapItem) => {
    await mapSelectHandler(map); // ✅ ヘッダーアクションフックのマップ選択ハンドラを呼び出す
    setIsMapListOpen(false);
  }

  const handleSharedMapSelect = async (map: SharedMapItem) => {
    await sharedMapSelectHandler(map); // ✅ ヘッダーアクションフックのシェアマップ選択ハンドラを呼び出す
    setIsMapListOpen(false);
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
          onSelectSharedMap={handleSharedMapSelect} // ✅ シェアマップ選択ハンドラを追加
          selectedMapId={selectedMap?.id ?? null} 
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
          <div className="hidden md:flex items-center space-x-2">          
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
          </div>

          {/* ユーザーメニュー */}
          <UserMenu
            isOpen={isLoginMenuOpen}
            onToggle={() => setIsLoginMenuOpen((prev) => !prev)}
            onGuestLogin={handleGuestLogin}
            onLogout={handleLogout}
            onOpenGroupList={() => {
              setIsGroupListOpen(true);
              setIsLoginMenuOpen(false); // 👈 メニューを閉じてからモーダルを開く
            }}
          />
        </div>

          <GroupListModal
            isOpen={isGroupListOpen}
            onClose={() => setIsGroupListOpen(false)}
            onSelectGroup={(group) => {
              setSelectedGroup(group);
              setSelectedGroupId(group?.id ?? null);
              setIsGroupListOpen(false);
            }}
          />
      </header>
    </>
  );
}
export default Header;