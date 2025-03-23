import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css"; // TODO: styleの統一&css修正
import GuestLoginButton from "../components/GuestLoginButton";
// import MapCreateModal from "../components/MapCreateModal"; // 追加
import MapListModal from "../components/MapListModal"; // 追加


const Header: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState<boolean>(false);
  const [selectedMap, setSelectedMap] = useState<{ id: number; name: string } | null>(null);

  
  return (
    <header className="header">
        <div className="left">
            <button className="menu-btn" id="menu-btn">☰</button>
         </div>

        <div className="center">
            <h1 className="header-title">Cafe Map</h1>
        </div>

        {/* TODO:ボタン仮置き */}
        <div className="right">
        
            <button id="myCafeButton">MyCafe</button>
            <button id="myCafeMapButton">MyCafeMap</button>
            {!loggedIn ? (
              <GuestLoginButton setLoggedIn={setLoggedIn} />
            ) : (
              <button onClick={() => setIsMapModalOpen(true)}>📋 マップ一覧</button>
            )}
            {/* マップ一覧モーダルを表示 */}
            <MapListModal
              isOpen={isMapModalOpen}
              onClose={() => setIsMapModalOpen(false)}
              onMapSelect={(map) => setSelectedMap(map)} // ← 追加
            />

            {/* プルダウンメニュー */}
            <select id="map-select" style={{ display: "none" }}>
              <option value="">マップを選択</option>
            </select>

            {/* 選択中のマップ名を表示するエリア */}
            {selectedMap && (
              <div id="selected-map-display">
                選択中のマップ：{selectedMap.name}
              </div>
            )}
        </div>
    </header>
  );
};

export default Header;
