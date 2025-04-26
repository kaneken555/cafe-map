// components/CafeDetailCard.tsx
import { useState } from "react";
import { Heart, Share2, ExternalLink } from "lucide-react";
import GoogleMapButton from "./GoogleMapButton"; // 先ほど作ったボタンコンポーネント
import { Cafe } from "../api/mockCafeData";
import { addCafeToMyCafe } from "../api/cafe"; // ✅ 追加

interface CafeDetailCardProps {
  cafe: Cafe;
  selectedMap: { id: number; name: string } | null; // ✅ 追加
}


const CafeDetailCard = ({ cafe, selectedMap }: CafeDetailCardProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? cafe.photoUrls.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === cafe.photoUrls.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="p-3">
      {/* タイトル・アイコン */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold">{cafe.name}</h2>
          {/* <h3 className="text-xl font-black">{cafe.name_en}</h3> */}
        </div>
        <div className="flex space-x-2 mt-1">
          <button 
            className="text-gray-600 hover:text-black"
            onClick={() => {
              if (!selectedMap) {
                alert("マップを選択してください");
                return;
              }
              addCafeToMyCafe(cafe);
            }}
          >
            <Heart size={20} />
          </button>
          <button className="text-gray-600 hover:text-black">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      {/* 営業情報 + Mapボタン */}
      <div className="mt-2 flex justify-between items-start">
        {/* 左側：営業情報 */}
        <div className="text-sm text-gray-800">
          <div className="flex space-x-4">
            <span>昼：{cafe.price_day}</span>
            <span>夜：{cafe.price_night}</span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-blue-600 font-semibold">{cafe.status}</span>
            <span className="text-gray-600">({cafe.openTime})</span>
          </div>
        </div>

        {/* 右側：Google Mapボタン */}
        <div>
          <GoogleMapButton url="https://www.google.com/maps/place/渋谷TSUTAYA/" />
        </div>
        </div>

      {/* TODO: 画像サイズ合わせ */}
      {/* カルーセル式画像表示 */}
      <div className="mt-4 relative">
        <img
          src={cafe.photoUrls[currentIndex]}
          alt={cafe.name}
          className="rounded-xl w-full object-cover"
        />
        {/* ← / → ボタン */}
        {cafe.photoUrls.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/50 rounded-full p-1"
            >
              ◀
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/50 rounded-full p-1"
            >
              ▶
            </button>
          </>
        )}
        {/* インジケーター */}
        <div className="flex justify-center mt-2 space-x-1">
          {cafe.photoUrls.map((_, index) => (
            <span
              key={index}
              className={`w-2 h-2 rounded-full ${
                currentIndex === index ? "bg-gray-800" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>


      {/* 住所・評価 */}
      <div className="mt-2 text-sm text-gray-700">
        <p className="mb-1">
          <span className="font-semibold">住所:</span> {cafe.address}
        </p>
        <p className="mb-1">
          <span className="font-semibold">評価:</span> ⭐️ {cafe.rating.toFixed(1)} / 5
        </p>
        <p className="mb-1">
          <span className="font-semibold">営業時間:</span> {cafe.openTime}
        </p>
        <p className="mb-1">
          <span className="font-semibold">電話番号:</span> {cafe.phoneNumber}
        </p>
        <p className="mb-1">
          <span className="font-semibold">HP:</span>{" "}
          {cafe.website ? (
            <a href={cafe.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              {cafe.website}
            </a>
          ) : (
            "なし"
          )}
        </p>
      </div>
    </div>
  );
};

export default CafeDetailCard;
