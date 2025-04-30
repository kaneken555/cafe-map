// pages/HomePage.tsx
import React, { useState } from "react";
import CafeDetailPanel from "../components/CafeDetailPanel";
import Header from "../components/Header";
import Map from "../components/Map";
import MyCafeListPanel from "../components/MyCafeListPanel"; // ✅ カフェ一覧パネル
import { Cafe, mockSearchResults } from "../api/mockCafeData"; // ✅ Cafe型をインポート


const HomePage: React.FC = () => {
  const [selectedMap, setSelectedMap] = useState<{ id: number; name: string } | null>(null); // ✅ マップ選択
  const [cafeList, setCafeList] = useState<Cafe[]>([]); // ✅ 表示カフェリスト
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null); // ✅ カフェ詳細
  const [isMyCafeListOpen, setIsMyCafeListOpen] = useState(false); // ✅ カフェ一覧パネルの表示
  const [searchResultCafes, setSearchResultCafes] = useState<Cafe[]>(mockSearchResults); // 検索結果
  const [myCafeList, setMyCafeList] = useState<Cafe[]>([]); // マイマップのカフェ
  const [mapMode, setMapMode] = useState<"search" | "mycafe">("search"); // 表示切替モード
  const [selectedCafeId, setSelectedCafeId] = useState<number | null>(null);

  

  return (
    <div className="flex flex-col h-screen w-full">
      <Header
        selectedMap={selectedMap}
        setSelectedMap={setSelectedMap}
        cafeList={cafeList}
        setCafeList={setCafeList}
        openCafeListPanel={() => setIsMyCafeListOpen(true)}
        setMyCafeList={setMyCafeList}     
        setMapMode={setMapMode}        
        mapMode={mapMode}
        isMyCafeListOpen={isMyCafeListOpen}
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
      {/* カフェ詳細パネル */}
      <CafeDetailPanel
        cafe={selectedCafe}
        onClose={() => {
          setSelectedCafe(null);
          setSelectedCafeId(null); // ✅ ここで選択解除！
        }}
        selectedMap={selectedMap}
        myCafeList={myCafeList} // ✅ 渡す
        setMyCafeList={setMyCafeList}
      />

      {/* Map（ここにアイコンボタンを配置） */}
      <div className="flex-grow">
        <Map 
          cafes={mapMode === "mycafe" ? myCafeList : searchResultCafes}
          onCafeIconClick={(cafe) => setSelectedCafe(cafe)} 
          selectedCafeId={selectedCafeId}
          setMapMode={setMapMode}
          setSelectedCafeId={setSelectedCafeId}
          />
      </div>

    </div>
  );
};

export default HomePage;
