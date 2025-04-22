// pages/HomePage.tsx
import React, { useState } from "react";
import CafeDetailPanel from "../components/CafeDetailPanel";
import Header from "../components/Header";
import Map from "../components/Map";
import MyCafeListPanel from "../components/MyCafeListPanel"; // ✅ カフェ一覧パネル
import { Cafe } from "../api/mockCafeData"; // ✅ Cafe型をインポート

const HomePage: React.FC = () => {
  const [selectedMap, setSelectedMap] = useState<{ id: number; name: string } | null>(null); // ✅ マップ選択
  const [cafeList, setCafeList] = useState<Cafe[]>([]); // ✅ 表示カフェリスト
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null); // ✅ カフェ詳細
  const [isMyCafeListOpen, setIsMyCafeListOpen] = useState(false); // ✅ カフェ一覧パネルの表示


  return (
    <div className="flex flex-col h-screen w-full">
      <Header
        selectedMap={selectedMap}
        setSelectedMap={setSelectedMap}
        cafeList={cafeList}
        setCafeList={setCafeList}
        openCafeListPanel={() => setIsMyCafeListOpen(true)}
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
        <Map cafes={cafeList} onCafeIconClick={(cafe) => setSelectedCafe(cafe)} />
      </div>

    </div>
  );
};

export default HomePage;
