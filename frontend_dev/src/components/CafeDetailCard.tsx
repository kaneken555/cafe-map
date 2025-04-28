// components/CafeDetailCard.tsx
import { useState } from "react";
import { Heart, Share2 } from "lucide-react";
import GoogleMapButton from "./GoogleMapButton"; // 先ほど作ったボタンコンポーネント
import { Cafe } from "../api/mockCafeData";
import { addCafeToMyCafe } from "../api/cafe"; 

interface CafeDetailCardProps {
  cafe: Cafe;
  selectedMap: { id: number; name: string } | null; 
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
              addCafeToMyCafe(selectedMap.id, cafe);
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


      {/* 住所・評価 (テーブル形式) */}
      <div className="mt-2 text-sm text-gray-700 overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            <tr className="border-b">
              <th className="text-left font-semibold pr-2 py-1 align-top">住所:</th>
              <td className="py-1">{cafe.address}</td>
            </tr>
            <tr className="border-b">
              <th className="text-left font-semibold pr-2 py-1 align-top">評価:</th>
              <td className="py-1">⭐️ {cafe.rating.toFixed(1)} / 5</td>
            </tr>
            <tr className="border-b">
              <th className="text-left font-semibold pr-2 py-1 align-top">営業時間:</th>
              <td className="py-1">{cafe.openTime}</td>
            </tr>
            <tr className="border-b">
              <th className="text-left font-semibold pr-2 py-1 align-top">電話番号:</th>
              <td className="py-1">{cafe.phoneNumber}</td>
            </tr>
            <tr>
              <th className="text-left font-semibold pr-2 py-1 align-top">HP:</th>
              <td className="py-1">
                {cafe.website ? (
                  <a href={cafe.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-words">
                    {cafe.website}
                  </a>
                ) : (
                  "なし"
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default CafeDetailCard;
