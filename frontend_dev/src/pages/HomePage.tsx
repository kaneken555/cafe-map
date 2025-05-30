// pages/HomePage.tsx
import React, { useState } from "react";
import CafeDetailPanel from "../components/CafeDetailPanel";
import Header from "../components/Header";
import Map from "../components/Map";
import MyCafeListPanel from "../components/MyCafeListPanel"; // ✅ カフェ一覧パネル
import SearchResultPanel from "../components/SearchResultPanel";
import { Cafe, mockSearchResults } from "../api/mockCafeData"; // ✅ Cafe型をインポート
import { MapMode } from "../types/map";
import { MAP_MODES } from "../constants/map";

// import { useMap } from "../contexts/MapContext";
import { useCafe } from "../contexts/CafeContext";


const HomePage: React.FC = () => {
  // const { selectedMap, setSelectedMap } = useMap(); // マップコンテキストからselectedMapとsetSelectedMapを取得
  const { cafeList, myCafeList, sharedMapCafeList } = useCafe(); // カフェコンテキストからcafeListとsetCafeListを取得

  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null); // ✅ カフェ詳細
  const [isMyCafeListOpen, setIsMyCafeListOpen] = useState(false); // ✅ カフェ一覧パネルの表示
  const [searchResultCafes, setSearchResultCafes] = useState<Cafe[]>(mockSearchResults); // 検索結果
  const [isSearchResultOpen, setIsSearchResultOpen] = useState(false); // ✅ 検索パネル表示用
  const [mapMode, setMapMode] = useState<MapMode>("search"); // 表示切替モード
  const [selectedCafeId, setSelectedCafeId] = useState<number | null>(null);
  const [shareUuid, setShareUuid] = useState<string | null>(null);

  

  return (
    <div className="flex flex-col h-screen w-full">
      <Header
        openCafeListPanel={() => setIsMyCafeListOpen(true)}
        closeCafeListPanel={() => setIsMyCafeListOpen(false)}
        setMapMode={setMapMode}        
        mapMode={mapMode}
        isMyCafeListOpen={isMyCafeListOpen}
        setShareUuid={setShareUuid} // ✅ シェアマップのUUIDをセットする関数
      />
      {/* マイカフェ一覧パネル */}
      <MyCafeListPanel
        isOpen={isMyCafeListOpen}
        onClose={() => setIsMyCafeListOpen(false)}
        cafes={cafeList}
        onCafeClick={(cafe) => {
          setSelectedCafe(cafe); // ✅ 選択カフェセット
          setSelectedCafeId(cafe.id); // ✅ 選択IDセット（今後何かに使う用？）
        }}
      />

      {/* 検索結果パネル */}
      <SearchResultPanel
        isOpen={isSearchResultOpen}
        onClose={() => setIsSearchResultOpen(false)}
        cafes={searchResultCafes}
        onCafeClick={(cafe) => {
          setSelectedCafe(cafe);
          setSelectedCafeId(cafe.id);
        }}
      />

      {/* カフェ詳細パネル */}
      <CafeDetailPanel
        cafe={selectedCafe}
        onClose={() => {
          setSelectedCafe(null);
          setSelectedCafeId(null);
        }}
      />

      {/* Map */}
      <div className="flex-grow">
        <Map 
          cafes={
            mapMode === MAP_MODES.mycafe
              ? myCafeList
              : mapMode === MAP_MODES.share
              ? sharedMapCafeList
              : searchResultCafes
          }          
          onCafeIconClick={(cafe) => setSelectedCafe(cafe)} 
          selectedCafeId={selectedCafeId}
          mapMode={mapMode}
          setMapMode={setMapMode}
          setSelectedCafeId={setSelectedCafeId}
          setSearchResultCafes={(cafes) => {
            setSearchResultCafes(cafes);
            setIsSearchResultOpen(true); // ✅ 検索結果パネル表示
          }}
          shareUuid={shareUuid} // ✅ シェアマップのUUIDを渡す
        />
      </div>

    </div>
  );
};

export default HomePage;
