// components/CafeDetailCard.tsx
import React from "react";
import clsx from "clsx";
import { Heart, Share2, CirclePlus } from "lucide-react";
import GoogleMapButton from "../GoogleMapButton/GoogleMapButton";
import CafeImageCarousel from "../CafeImageCarousel/CafeImageCarousel"; 
import CafeDetailInfoTable from "../CafeDetailInfoTable/CafeDetailInfoTable"; 
import { Cafe } from "../../types/cafe";


interface CafeDetailCardProps {
  cafe: Cafe;
  myCafeList?: Cafe[];
  onAddClick?: () => void; // ✅ 追加ボタン用
  onAddCafe: (cafe: Cafe) => void;
  onShareCafe?: (cafe: Cafe) => void;
}


const CafeDetailCard: React.FC<CafeDetailCardProps> = ({ 
  cafe, 
  myCafeList, 
  onAddClick = () => {}, // ✅ デフォルトは何もしない 
  onAddCafe,
  onShareCafe,
}) => {
  // ✅ このカフェが登録済みか？
  const isRegistered = myCafeList?.some((myCafe) => myCafe.placeId === cafe.placeId) ?? false;

  const handleAddCafe = () => {
    onAddCafe(cafe);
  }

  const handleShareCafe = () => {
    onShareCafe?.(cafe);
  }


  const getTodayOpenTime = (openTime: string | undefined): string | null => {
    if (!openTime) return null;
  
    const days = [
      "日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日",
    ];
    const today = new Date().getDay(); // 0=日曜日〜6=土曜日
    const todayLabel = days[today];
  
    const timeMap = new Map<string, string>();
    const timeEntries = openTime.match(/([^\s:：、]+):\s*([^,、)]+)/g); // 月曜日: xx～xx の形式を抽出
    if (timeEntries) {
      timeEntries.forEach((entry) => {
        const [day, time] = entry.split(":");
        if (day && time) {
          timeMap.set(day.trim(), time.trim());
        }
      });
    }
  
    return timeMap.get(todayLabel) ?? null;
  };
  

  return (
    <div className="h-[calc(100vh-4rem-2rem)] flex flex-col px-2">
      {/* タイトルとアクションボタン（お気に入り・共有） */}
      <div className="flex justify-between items-start mt-4 mb-3">
        <div>
          <h2 className="text-xl font-bold">{cafe.name}</h2>
          {/* <h3 className="text-xl font-black">{cafe.name_en}</h3> */}
        </div>
        <div className="flex space-x-2 mt-1">
          {onAddClick && (
            <button
              className={clsx(
                "hover:text-black cursor-pointer",
                "text-gray-600"
              )}
              onClick={onAddClick}
            >
              <CirclePlus size={20} />
            </button>
          )}

          <button 
            className={clsx(
              "hover:text-black cursor-pointer",
              isRegistered ? "text-red-500" : "text-gray-600"
            )}
            onClick={handleAddCafe}
          >
            <Heart size={20} />
          </button>
          <button 
            className={clsx(
              "hover:text-black cursor-pointer",
              "text-gray-600"
            )}
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
            {/* <div className="flex space-x-4"> */}
              {/* <span>昼：{cafe.price_day || "不明"}</span> */}
              {/* <span>夜：{cafe.price_night || "不明"}</span> */}
            {/* </div> */}
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-blue-600 font-semibold">{cafe.status}</span>
              {cafe.openTime && (
                <span className="text-gray-600">
                  営業時間: {getTodayOpenTime(cafe.openTime) ?? "不明"}
                </span>
              )}
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
