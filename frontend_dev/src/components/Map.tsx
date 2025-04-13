import React from "react";

interface MapProps {
  onCafeIconClick: () => void;
}

const Map: React.FC<MapProps> = ({ onCafeIconClick }) => {
  return (
    <div className="relative h-full w-full bg-gray-100">
      {/* 仮のマップアイコンボタン */}
      <button
        onClick={onCafeIconClick}
        className="absolute top-4 left-4 z-10 px-3 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
      >
        アイコン（仮）
      </button>

      {/* 仮のマップ背景 */}
      <div className="w-full h-[600px] bg-green-200 flex items-center justify-center">
        <span className="text-gray-700">ここに Google Map を表示予定</span>
      </div>
    </div>
  );
};

export default Map;
