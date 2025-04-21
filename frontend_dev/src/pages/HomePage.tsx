// pages/HomePage.tsx
import React, { useState } from "react";
import CafeDetailPanel from "../components/CafeDetailPanel";
import Map from "../components/Map";
import { Cafe } from "../api/mockCafeData"; // ✅ Cafe型をインポート

const HomePage: React.FC = () => {
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null); // ✅ 型を統一


  return (
    <div className="flex h-screen w-full">
      {/* カフェ詳細パネル */}
      <CafeDetailPanel cafe={selectedCafe} onClose={() => setSelectedCafe(null)} />

      {/* Map（ここにアイコンボタンを配置） */}
      <div className="flex-grow h-full">
        <Map onCafeIconClick={(cafe) => setSelectedCafe(cafe)} />
      </div>

    </div>
  );
};

export default HomePage;
