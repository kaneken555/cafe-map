import React, { useState } from "react";
import CafeDetailPanel from "../components/CafeDetailPanel";
import Map from "../components/Map";

const HomePage: React.FC = () => {
  const [selectedCafe, setSelectedCafe] = useState<{
    name: string;
    address: string;
    photoUrl: string;
    openingHours: string;
    priceLevel: string;
  } | null>(null);

  const handleIconClick = () => {
    setSelectedCafe({
      name: "スターバックス コーヒー SHIBUYA TSUTAYA 1F店",
      address: "東京都渋谷区道玄坂2丁目24-1",
      photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Starbucks_Logo.svg/800px-Starbucks_Logo.svg.png", // 仮の画像URL
      openingHours: "07:00 - 22:30",
      priceLevel: "昼：￥999 / 夜：￥999",
    });
  };

  return (
    <div className="flex">
      {/* カフェ詳細パネル */}
      <CafeDetailPanel cafe={selectedCafe} onClose={() => setSelectedCafe(null)} />

      {/* Map（ここにアイコンボタンを配置） */}
      <div className="flex-grow">
        <Map
          onCafeIconClick={() =>
            setSelectedCafe({
              name: "スターバックス コーヒー SHIBUYA TSUTAYA 1F店",
              address: "東京都渋谷区道玄坂2丁目24-1",
              photoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Starbucks_Logo.svg/800px-Starbucks_Logo.svg.png",
              openingHours: "07:00 - 22:30",
              priceLevel: "昼：￥999 / 夜：￥999",
            })
          }
        />
      </div>

    </div>
  );
};

export default HomePage;
