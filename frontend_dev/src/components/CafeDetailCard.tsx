// components/CafeDetailCard.tsx
import React from "react";
import { Heart, Share2 } from "lucide-react";
import GoogleMapButton from "./GoogleMapButton";
import CafeImageCarousel from "./CafeImageCarousel"; 
import CafeDetailInfoTable from "./CafeDetailInfoTable"; 
import { Cafe } from "../api/mockCafeData";
import { addCafeToMyCafe } from "../api/cafe"; 
import { toast } from "react-hot-toast";
import { MapItem } from "../types/map"; // ← 共通型をインポート


interface CafeDetailCardProps {
  cafe: Cafe;
  selectedMap: MapItem | null; 
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

  const handleShareCafe = () => {
    toast("カフェ共有機能は未実装です");
  }

  return (
    <div className="h-[calc(100vh-4rem-2rem)] flex flex-col px-2">
      {/* タイトルとアクションボタン（お気に入り・共有） */}
      <div className="flex justify-between items-start mt-4 mb-3">
        <div>
          <h2 className="text-xl font-bold">{cafe.name}</h2>
          {/* <h3 className="text-xl font-black">{cafe.name_en}</h3> */}
        </div>
        <div className="flex space-x-2 mt-1">
          <button 
            className={`${
              isRegistered ? "text-red-500" : "text-gray-600"
            } hover:text-black cursor-pointer`}
            onClick={handleAddCafe}
          >
            <Heart size={20} />
          </button>
          <button 
            className="text-gray-600 hover:text-black cursor-pointer"
            onClick={handleShareCafe}
          >
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 pr-1">
        {/* 営業情報とGoogle Mapリンク */}
        <div className="mt-3 flex justify-between items-start">
          {/* 左側：営業情報 */}
          <div className="text-sm text-gray-800">
            <div className="flex space-x-4">
              <span>昼：{cafe.price_day || "不明"}</span>
              <span>夜：{cafe.price_night || "不明"}</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-blue-600 font-semibold">{cafe.status}</span>
              <span className="text-gray-600">({cafe.openTime})</span>
            </div>
          </div>
          <div>
            <GoogleMapButton
              url={`https://www.google.com/maps/place/?q=place_id:${cafe.placeId}`} 
            />
          </div>
        </div>

        {/* TODO: 画像サイズ合わせ */}
        {/* カフェ画像カルーセル */}
        <CafeImageCarousel
          photoUrls={cafe.photoUrls}
          altText={cafe.name}
        />

        {/* 詳細情報テーブル */}
        <CafeDetailInfoTable
          address={cafe.address}
          rating={cafe.rating}
          openTime={cafe.openTime}
          phoneNumber={cafe.phoneNumber}
          website={cafe.website}
        />
      </div>
    </div>
  );
};

export default CafeDetailCard;
