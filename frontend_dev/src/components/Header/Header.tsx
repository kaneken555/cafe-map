// components/Header.tsx
import React, { useState } from "react";
import clsx from "clsx";
import SideMenu from "../SideMenu/SideMenu";
import HeaderButton from "../HeaderButton/HeaderButton";
import UserMenu from "../UserMenu/UserMenu";
import GroupListModal from "../GroupListModal/GroupListModal";
import { Coffee, List as ListIcon, Layers, Menu } from "lucide-react";
// import { MapItem, SharedMapItem } from "../types/map";
import { APP_TITLE } from "../../constants/app"; // アプリタイトルをインポート
import { ICON_SIZES } from "../../constants/ui";

// Contexts
import { useAuth } from "../../contexts/AuthContext";
import { useMap } from "../../contexts/MapContext";
import { useGroup } from "../../contexts/GroupContext";

import { useHeaderActions } from "../../hooks/useHeaderActions"; // ✅ ヘッダーアクションフックをインポート

import ReactGA from "react-ga4";


interface HeaderProps {
  closeCafeListPanel: () => void;
  isMyCafeListOpen: boolean;
  setShareUuid: React.Dispatch<React.SetStateAction<string | null>>; // ✅ シェアマップのUUIDをセットする関数
  onOpenCafeList: () => void; // ✅ カフェ一覧パネルを開く関数
  onOpenMapList: () => void; // ✅ 追加
  isSharedMapView?: boolean; // ✅ シェアマップビューかどうか
  sharedMapName?: string; // ✅ シェアマップの名前
}

const Header: React.FC<HeaderProps> = ({
  closeCafeListPanel,
  isMyCafeListOpen,
  setShareUuid, // ✅ シェアマップのUUIDをセットする関数
  onOpenCafeList, // ✅ カフェ一覧パネルを開く関数
  onOpenMapList,
  isSharedMapView = false, // ✅ デフォルトはfalse
  sharedMapName, // ✅ シェアマップの名前
}) => {    
  const { user } = useAuth();
  const { selectedMap } = useMap(); // マップリストとセット関数をコンテキストから取得
  const { setSelectedGroup, setSelectedGroupId } = useGroup(); // グループリストのセット関数をコンテキストから取得

  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  // const [isMapListOpen, setIsMapListOpen] = useState(false);
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);
  const [isGroupListOpen, setIsGroupListOpen] = useState(false); // 👈 グループ一覧モーダル

  const {
    guestLoginHandler,
    logoutHandler,
    // mapSelectHandler,
    // sharedMapSelectHandler,
  } = useHeaderActions({ closeCafeListPanel, setShareUuid });
  

  const handleGuestLogin = async () => {
    await guestLoginHandler(); // ✅ ヘッダーアクションフックのゲストログインハンドラを呼び出す
    setIsLoginMenuOpen(false);

    ReactGA.gtag("event", "login", {
      method: "guest",
    });
    
  }

  const handleLogout = async () => {
    await logoutHandler(); // ✅ ヘッダーアクションフックのログアウトハンドラを呼び出す
    setIsLoginMenuOpen(false);  // メニューを閉じる
  }

  const handleOpenGroupList = () => {
    setIsGroupListOpen(true);
    setIsLoginMenuOpen(false);
  };
  
  return (
    <>
      <SideMenu 
        isOpen={isSideMenuOpen} 
        onClose={() => setIsSideMenuOpen(false)} 
      />
        
      {/* <header className="w-full h-12 md:h-16 px-2 md:px-4 flex justify-between items-center bg-gradient-to-r from-yellow-300 to-yellow-500 shadow-md"> */}
      <header
        className={clsx(
          "w-full flex justify-between items-center shadow-md",
          "h-12 md:h-16 px-2 md:px-4",
          "bg-gradient-to-r from-yellow-300 to-yellow-500"
        )}
      >

        {/* 左：サイドメニュー */}
        <div className="flex items-center">
          <button onClick={() => setIsSideMenuOpen(true)} className="text-2xl cursor-pointer">
            <Menu size={ICON_SIZES.MEDIUM} />
          </button>
        </div>

        {/* 中央：タイトル */}
        <div className="flex-grow flex justify-center items-center space-x-2">
          <Coffee size={ICON_SIZES.MEDIUM} />
          <div className="flex flex-col md:flex-row items-center md:space-x-2">
            <h1 className="text-lg md:text-2xl font-bold text-black">{APP_TITLE}</h1>
            {isSharedMapView && sharedMapName && (
              <div className="flex items-center space-x-1 md:space-x-2">
                <span className="text-gray-600 hidden md:inline">|</span>
                <span className="text-sm md:text-base font-semibold text-gray-700">{sharedMapName}</span>
                <span className="text-xs md:text-sm px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full border border-blue-300">
                  共有マップ
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 右：操作ボタン群 */}
        <div className="flex items-center space-x-2">
          {/* <div className="flex items-center space-x-2">        */}
          <div className="hidden md:flex items-center space-x-2">
            {/* シェアマップビューでは My Café List と My Café Map を非表示 */}
            {!isSharedMapView && (
              <>
                <HeaderButton
                  onClick={onOpenCafeList}
                  disabled={!user}
                  icon={<ListIcon size={ICON_SIZES.MEDIUM} />}
                  label="My Café List"
                  active={isMyCafeListOpen}
                />
              </>
            )}

            <HeaderButton
              onClick={onOpenMapList}
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
            onOpenGroupList={handleOpenGroupList} // グループ一覧を開くハンドラ
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