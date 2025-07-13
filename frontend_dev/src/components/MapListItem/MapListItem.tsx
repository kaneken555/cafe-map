// components/MapListItem.tsx
import React, { useState } from "react";
import ShareMapModal from "../ShareMapModal";
import { CheckCircle, Trash2, Share as ShareIcon } from "lucide-react";
import { MapItem } from "../../types/map";
import { ICON_SIZES } from "../../constants/ui";

import { useMapModals } from "../../hooks/useMapModals";


interface MapListItemProps {
  map: MapItem;
  selectedMapId: number | null;
  onSelect: (map: MapItem) => void;
  onClose: () => void;
  onDeleteClick: (map: MapItem) => void;
  mapModals: ReturnType<typeof useMapModals>; // ✅ 型は補完から取得 or 別途定義

  onShare: (id: number) => Promise<string | null>;
  onSelectMap: (map: MapItem, onSelect: any, onClose: any) => void;
}
  
const MapListItem: React.FC<MapListItemProps> = ({ 
  map, 
  selectedMapId,
  onSelect,
  onClose,
  onDeleteClick,
  mapModals,
  onShare,
  onSelectMap,
}) => {

  const { 
    isShareModalOpen, openShareModal, closeShareModal,
  } = mapModals;
  
  const [shareUrl, setShareUrl] = useState("");

  const handleSelect = () => {
    onSelectMap(map, onSelect, onClose);
  };


  const handleShare = async () => {
    const url = await onShare(map.id);
    if (url !== null) {
      setShareUrl(url);
      openShareModal();
    }
  };


  return (
    <>
      {/* モーダル呼び出し */}
      <ShareMapModal
        isOpen={isShareModalOpen}
        onClose={() => {
          closeShareModal();
          setShareUrl(""); // ✅ モーダルを閉じるときにリセット！
        }}
        shareUrl={shareUrl}
        setShareUrl={setShareUrl}
        selectedMap={map} // ✅ 選択されたマップを渡す
      />

      <li className="flex justify-between items-center border px-4 py-2 rounded">
        <span className="truncate">{map.name}</span>
        <div className="flex space-x-2">
        {map.id === selectedMapId ? (
          <div className="w-12 flex flex-col items-center text-green-600">
            <CheckCircle size={ICON_SIZES.MEDIUM} />
            <span className="text-sm">選択中</span>
          </div>
        ) : (
          <button
            onClick={handleSelect}
            className="w-12 flex flex-col items-center text-gray-700 hover:text-blue-500 cursor-pointer"
          >
            <CheckCircle size={ICON_SIZES.MEDIUM} />
            <span className="text-sm">選択</span>
          </button>
        )}
          <button
            onClick={() => onDeleteClick(map)}
            className="w-12 flex flex-col items-center text-gray-700 hover:text-red-500 cursor-pointer"
          >
            <Trash2 size={ICON_SIZES.MEDIUM} />  {/* ゴミ箱アイコン */}
            <span className="text-sm">Delete</span>
          </button>
          <button
            onClick={handleShare}
            className="w-12 flex flex-col items-center text-gray-700 hover:text-blue-500 cursor-pointer"
          >
            <ShareIcon size={ICON_SIZES.MEDIUM} /> {/* シェアアイコン */}
            <span className="text-sm">Share</span>
          </button>
        </div>
      </li>
    </>
  );
};
  
export default MapListItem;
  