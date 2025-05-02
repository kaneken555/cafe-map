// components/Header.tsx
import React, { useState } from "react";
import SideMenu from "./SideMenu";
import MapListModal from "./MapListModal";
import { Coffee, Map as MapIcon, List, Layers, Menu } from "lucide-react";
import { getCafeList } from "../api/cafe";
import { Cafe } from "../api/mockCafeData";
import { guestLogin } from "../api/auth";
import { getMapList } from "../api/map";
import HeaderButton from "./HeaderButton";
import UserMenu from "./UserMenu";
import { toast } from "react-hot-toast";

interface HeaderProps {
  selectedMap: { id: number; name: string } | null;
  setSelectedMap: (map: { id: number; name: string } | null) => void;
  cafeList: Cafe[];
  setCafeList: (cafes: Cafe[]) => void;
  openCafeListPanel: () => void;
  setMyCafeList: (cafes: Cafe[]) => void;   
  mapMode: "search" | "mycafe";
  setMapMode: (mode: "search" | "mycafe") => void; 
  isMyCafeListOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({
  selectedMap,
  setSelectedMap,
  cafeList,
  setCafeList,
  openCafeListPanel,
  setMyCafeList,
  mapMode,
  setMapMode, 
  isMyCafeListOpen,

}) => {    
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isMapListOpen, setIsMapListOpen] = useState(false);
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);
  const [user, setUser] = useState<{ id: number; name: string } | null>(null); // ✅ ログインユーザー保持
  const [mapList, setMapList] = useState<{ id: number; name: string }[]>([]); // ✅ マップ一覧保持

  
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

    const userData = await guestLogin();  // 👈 ここで待つ！
    if (userData) {
      setUser({ id: userData.id, name: userData.name }); // 👈 サーバーが返してきた本物のゲストユーザー情報をセット
      toast.success("ゲストログインしました");

      // ログイン時にマップを取得する
      const maps = await getMapList();
      setMapList(maps);
      console.log("取得したマップ一覧:", maps);
      
    } else {
      toast.error("ゲストログインに失敗しました");
    }
    setIsLoginMenuOpen(false);
  }

  const handleLogout = () => {
    setUser(null);              // ✅ ログアウト（ユーザー消す）
    setSelectedMap(null);       // ✅ 選択中マップもリセット
    setCafeList([]);            // ✅ カフェリストもリセット（オプション）
    setMapMode("search");       // ✅ マップモードもリセット（オプション）
    setIsLoginMenuOpen(false);  // メニューを閉じる
    toast.success("ログアウトしました");
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
          onSelectMap={async (map) => {
            setSelectedMap(map);
            setIsMapListOpen(false);

            const cafes = await getCafeList(map.id);  // ✅ マップ選択と同時にカフェ取得
            setCafeList(cafes);
            setMyCafeList(cafes); // 地図用にも保存（もし必要なら）
          }}
          selectedMapId={selectedMap?.id ?? null} 
          mapList={mapList} 
          setMapList={setMapList}
          user={user} 
          setSelectedMap={setSelectedMap}
        />
        
      <header className="w-full h-16 px-4 flex justify-between items-center bg-gradient-to-r from-yellow-300 to-yellow-500 shadow-md">
        {/* 左：サイドメニュー */}
        <div className="flex items-center">
          <button onClick={() => setIsSideMenuOpen(true)} className="text-2xl cursor-pointer">
            <Menu size={24} />
          </button>
        </div>

        {/* 中央：タイトル */}
        <div className="flex-grow flex justify-center items-center space-x-2">
          <Coffee size={24} />
          <h1 className="text-2xl font-bold text-black">Café Map</h1>
        </div>

        {/* 右：操作ボタン群 */}
        <div className="flex items-center space-x-2">
          <HeaderButton
            onClick={handleOpenCafeList}
            disabled={!user}
            icon={<List size={24} />}
            label="My Café List"
            active={isMyCafeListOpen}
          />

          <HeaderButton
            onClick={handleShowMyCafeMap}
            disabled={!user}
            icon={<MapIcon size={24} />}
            label="My Café Map"
            active={mapMode === "mycafe"} // ✅ 現在のモードによって強調
          />

          <HeaderButton
            onClick={handleOpenMapList}
            disabled={!user}
            icon={<Layers size={24} />}
            label={selectedMap?.name || "My Map List"}
            active={!!selectedMap} // ✅ 現在のマップによって強調
          />

          <UserMenu
            user={user}
            isOpen={isLoginMenuOpen}
            onToggle={() => setIsLoginMenuOpen((prev) => !prev)}
            onGuestLogin={handleGuestLogin}
            onLogout={handleLogout}
          />
        </div>
      </header>
    </>
  );
}
export default Header;