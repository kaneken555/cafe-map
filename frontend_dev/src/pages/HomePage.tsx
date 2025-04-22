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
  

  return (
    <div className="flex flex-col h-screen w-full">
      <Header
        selectedMap={selectedMap}
        setSelectedMap={setSelectedMap}
        cafeList={cafeList}
        setCafeList={setCafeList}
        openCafeListPanel={() => setIsMyCafeListOpen(true)}
        setMyCafeList={setMyCafeList}         // ✅ 追加
        setMapMode={setMapMode}               // ✅ 追加
      />
      {/* カフェ詳細パネル */}
      <CafeDetailPanel cafe={selectedCafe} onClose={() => setSelectedCafe(null)} />

      <MyCafeListPanel
        isOpen={isMyCafeListOpen}
        onClose={() => setIsMyCafeListOpen(false)}
        cafes={cafeList}
      />

      {/* Map（ここにアイコンボタンを配置） */}
      <div className="flex-grow">
        <Map 
          cafes={mapMode === "mycafe" ? myCafeList : searchResultCafes}
          onCafeIconClick={(cafe) => setSelectedCafe(cafe)} />
      </div>

    </div>
  );
};

export default HomePage;
