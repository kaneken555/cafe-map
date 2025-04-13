import React, { useState } from "react";
import SideMenu from "./SideMenu";
import MapListModal from "./MapListModal"; // ← 追加
import MyCafeListPanel from "./MyCafeListPanel"; // ← 追加
import { ArrowRightToLine, User, LogIn } from "lucide-react"; // 任意アイコン（lucide-react を使う場合）
import { Coffee } from "lucide-react";
import { Map as MapIcon } from "lucide-react"; // ← アイコンの読み込み（必要に応じて）


const Header: React.FC = () => {
    const [isSideMenuOpen, setIsSideMenuOpen] = useState(false); // ← メニュー開閉状態
    const [isMapListOpen, setIsMapListOpen] = useState(false); // ← 追加
    const [isMyCafeListOpen, setIsMyCafeListOpen] = useState(false); // ← 追加
    const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false); // 👈 ログインメニューの開閉


    return (
    <>
    <SideMenu isOpen={isSideMenuOpen} onClose={() => setIsSideMenuOpen(false)} />
    <MapListModal isOpen={isMapListOpen} onClose={() => setIsMapListOpen(false)} />
    <MyCafeListPanel isOpen={isMyCafeListOpen} onClose={() => setIsMyCafeListOpen(false)} />

        
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
        <button
            onClick={() => setIsMyCafeListOpen(true)}
            className="flex flex-col items-center justify-center px-2 py-1 border border-black rounded bg-white text-black hover:bg-gray-100 w-21 h-14"
          >
            <MapIcon size={24} />
            <span className="text-[10px] mt-1">My Café List</span>
        </button>
        <button
          className="flex flex-col items-center justify-center px-2 py-1 border border-black rounded bg-white text-black hover:bg-gray-100 w-21 h-14"
        >
          <MapIcon size={24} />
          <span className="text-[10px] mt-1">My Café Map</span>
        </button>
        <button
            onClick={() => setIsMapListOpen(true)}
            className="flex flex-col items-center justify-center px-2 py-1 border border-black rounded bg-white text-black hover:bg-gray-100 w-21 h-14"
            >
            <MapIcon size={24} />
            <span className="text-[10px] mt-1">My Map List</span>
        </button>
              {/* ▼ ログインボタン */}
              <div className="relative">
                <button
                  onClick={() => setIsLoginMenuOpen((prev) => !prev)}
                  className="flex flex-col items-center justify-center px-2 py-1 border border-black rounded bg-white text-black hover:bg-gray-100 w-18 h-14"
                  title="ログイン"
                >
                  <ArrowRightToLine size={22} />
                  <span className="text-[10px] mt-1">ログイン</span>
                </button>

            {/* ▼ ドロップダウンメニュー */}
            {isLoginMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-50">
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                  onClick={() => {
                    alert("ゲストログイン");
                    setIsLoginMenuOpen(false);
                  }}
                >
                  <User size={16} />
                  <span>ゲストユーザーとしてログイン</span>
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                  onClick={() => {
                    alert("Googleログイン");
                    setIsLoginMenuOpen(false);
                  }}
                >
                  <LogIn size={16} />
                  <span>Googleアカウントでログイン</span>
                </button>
              </div>
            )}
          </div>
      </div>

    </header>
    </>
  );
}
export default Header;