import { Heart, Share2, ExternalLink } from "lucide-react";
import GoogleMapButton from "./GoogleMapButton"; // 先ほど作ったボタンコンポーネント

interface CafeData {
  name: string;
  name_en: string;
  price_day: string;
  price_night: string;
  status: string;
  hours: string;
  photoUrl: string;
  mapUrl: string;
}

const CafeDetailCard = ({ cafe }: { cafe: CafeData }) => {
  return (
    <div className="p-4">
      {/* タイトル・アイコン */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-bold">{cafe.name}</h2>
          <h3 className="text-xl font-black">{cafe.name_en}</h3>
        </div>
        <div className="flex space-x-2 mt-1">
          <button className="text-gray-600 hover:text-black">
            <Heart size={20} />
          </button>
          <button className="text-gray-600 hover:text-black">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <div className="mt-2 flex justify-between items-start">
        {/* 左側：営業情報 */}
        <div className="text-sm text-gray-800">
            <div className="flex space-x-4">
            <span>昼：{cafe.price_day}</span>
            <span>夜：{cafe.price_night}</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
            <span className="text-blue-600 font-semibold">{cafe.status}</span>
            <span className="text-gray-600">({cafe.hours})</span>
            </div>
        </div>

        {/* 右側：Google Mapボタン */}
        <div>
            <GoogleMapButton url="https://www.google.com/maps/place/渋谷TSUTAYA/" />
        </div>
        </div>

      {/* 画像 */}
      <div className="mt-4">
        <img
          src={cafe.photoUrl}
          alt={cafe.name}
          className="rounded-xl w-full"
        />
      </div>
    </div>
  );
};

export default CafeDetailCard;
