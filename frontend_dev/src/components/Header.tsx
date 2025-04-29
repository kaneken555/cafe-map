// components/Header.tsx
import React, { useState } from "react";
import SideMenu from "./SideMenu";
import MapListModal from "./MapListModal"; 
import { ArrowRightToLine, User, LogIn, Coffee, Map as MapIcon } from "lucide-react";
import { getCafeList } from "../api/cafe"; // Cafe 型も import
import { Cafe } from "../api/mockCafeData"; 
import { guestLogin } from "../api/auth";
import { getMapList } from "../api/map";
import LoginMenu from "./LoginMenu"; 
import HeaderButton from "./HeaderButton"; 
import { toast } from "react-hot-toast";

interface HeaderProps {
  selectedMap: { id: number; name: string } | null;
  setSelectedMap: (map: { id: number; name: string } | null) => void;
  cafeList: Cafe[];
  setCafeList: (cafes: Cafe[]) => void;
  openCafeListPanel: () => void;
  setMyCafeList: (cafes: Cafe[]) => void;   
  mapMode: "search" | "mycafe"; // ✅ 追加！
  setMapMode: (mode: "search" | "mycafe") => void; 
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

}) => {    
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [isMapListOpen, setIsMapListOpen] = useState(false);
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);
  const [user, setUser] = useState<{ id: number; name: string } | null>(null); // ✅ ログインユーザー保持
  const [mapList, setMapList] = useState<{ id: number; name: string }[]>([]); // ✅ マップ一覧保持

  
  const handleOpenCafeList = async () => {
    if (!selectedMap) {
      toast.error("マップを選択してください"); 
      return;
    }
    openCafeListPanel();
  };

  const handleShowCafeMap = async () => {
    if (!selectedMap) {
      toast.error("マップを選択してください"); 
      return;
    }
    setMapMode("mycafe");         // 表示モード切り替え
  };


  const handleOpenMapList = async () => {
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
      <SideMenu isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} />
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
        />
        
      <header className="w-full h-16 px-4 flex justify-between items-center bg-gradient-to-r from-yellow-300 to-yellow-500 shadow-md">
        {/* 左：メニュー */}
        <div className="flex items-center">
          <button onClick={() => setIsSideMenuOpen(true)} className="text-2xl">
              ☰
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
            icon={<MapIcon size={24} />}
            label="My Café List"
          />

          <HeaderButton
            onClick={handleShowCafeMap}
            disabled={!user}
            icon={<MapIcon size={24} />}
            label="My Café Map"
            active={mapMode === "mycafe"} // ✅ 現在のモードによって強調
          />

          <HeaderButton
            onClick={handleOpenMapList}
            disabled={!user}
            icon={<MapIcon size={24} />}
            label={selectedMap?.name || "My Map List"}
          />


          {/* ▼ ログインボタン */}
          <div className="relative">
            <button
              className="flex flex-col items-center justify-center px-2 py-1 border border-black rounded bg-white text-black cursor-pointer hover:bg-gray-100 w-18 h-14"
              onClick={() => setIsLoginMenuOpen((prev) => !prev)}
              title={user ? user.name : "ログイン"} // ✅ ツールチップも切り替えられる
              >
              <ArrowRightToLine size={22} />
              <span className="text-[10px] mt-1">
                {user ? user.name : "ログイン"} {/* ✅ ここも */}
              </span>
            </button>

            {/* ▼ ドロップダウンメニュー */}
            <LoginMenu
              isOpen={isLoginMenuOpen}
              user={user}
              onGuestLogin={handleGuestLogin}
              onTestLogin={() => {
                // setUser({ id: 2, name: "テストユーザー" });
                toast.error("Googleログインは未実装です");
                setIsLoginMenuOpen(false);
              }}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </header>
    </>
  );
}
export default Header;