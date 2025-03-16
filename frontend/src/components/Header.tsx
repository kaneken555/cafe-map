import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Header.css"; // TODO: styleの統一&css修正
import GuestLoginButton from "../components/GuestLoginButton";


const Header: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

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
              <button>マップ作成</button>
            )}
            {/* <button id="mapButton">Map作成</button> */}
            {/* <button id="myMapListButton">📋 マップ一覧</button> */}

            {/* プルダウンメニュー */}
            <select id="map-select" style={{ display: "none" }}>
              <option value="">マップを選択</option>
            </select>

            {/* 選択中のマップ名を表示するエリア */}
            <div id="selected-map-display"></div>
        </div>
    </header>
  );
};

export default Header;
