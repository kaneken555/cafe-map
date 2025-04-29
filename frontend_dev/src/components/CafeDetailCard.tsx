// components/CafeDetailCard.tsx
import React from "react";
import { Heart, Share2 } from "lucide-react";
import GoogleMapButton from "./GoogleMapButton";
import { Cafe } from "../api/mockCafeData";
import { addCafeToMyCafe } from "../api/cafe"; 
import CafeImageCarousel from "./CafeImageCarousel"; 
import CafeDetailInfoTable from "./CafeDetailInfoTable"; 
import { toast } from "react-hot-toast";

interface CafeDetailCardProps {
  cafe: Cafe;
  selectedMap: { id: number; name: string } | null; 
  myCafeList?: Cafe[];
  setMyCafeList: React.Dispatch<React.SetStateAction<Cafe[]>>;
}


const CafeDetailCard: React.FC<CafeDetailCardProps> = ({ cafe, selectedMap, myCafeList, setMyCafeList }) => {

  // ✅ このカフェが登録済みか？
  const isRegistered = myCafeList?.some((myCafe) => myCafe.placeId === cafe.placeId) ?? false;

  const handleAddCafe = () => {
    if (!selectedMap) return toast.error("マップを選択してください");
    addCafeToMyCafe(selectedMap.id, cafe);
    setMyCafeList(prev => [...prev, cafe]); // ✅ ここでmyCafeListを更新する！
  }

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
            className={`${isRegistered ? "text-red-500" : "text-gray-600"} hover:text-black`} // ✅ 色を切り替え
            onClick={handleAddCafe}
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
      <CafeImageCarousel
        photoUrls={cafe.photoUrls}
        altText={cafe.name}
      />

      {/* 住所・評価 (テーブル形式) */}
      <CafeDetailInfoTable
        address={cafe.address}
        rating={cafe.rating}
        openTime={cafe.openTime}
        phoneNumber={cafe.phoneNumber}
        website={cafe.website}
      />

    </div>
  );
};

export default CafeDetailCard;
