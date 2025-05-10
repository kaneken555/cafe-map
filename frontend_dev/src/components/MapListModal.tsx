// components/MapListModal.tsx
import React, { useState } from "react";
import MapCreateModal from "./MapCreateModal"; 
import { mockMapData } from "../api/mockMapData"; 
import MapListItem from "./MapListItem"; 
import { Coffee, X } from "lucide-react";
import { MapItem } from "../types/map";
import { User as UserType } from "../types/user";


interface MapListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMap: (map: MapItem) => void;
  selectedMapId: number | null;
  mapList: MapItem[];
  setMapList: React.Dispatch<React.SetStateAction<MapItem[]>>; 
  user: UserType | null; 
  setSelectedMap: (map: MapItem | null) => void;
}

const MapListModal: React.FC<MapListModalProps> = ({ isOpen, onClose, onSelectMap, selectedMapId, mapList, setMapList, user, setSelectedMap }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); 
  const filteredMaps = mapList;
  // const filteredMaps = user
  // ? mockMapData.filter((map) => map.userId === user.id) // ✅ userId一致のみ
  // : []; // 未ログインなら空配列

  if (!isOpen) return null;


  return (
    <>
      {/* マップ作成モーダル */}
      <MapCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        setMapList={setMapList} 
      />

      {/* マップ一覧モーダル */}
      <div
        className="fixed inset-0 bg-black/30 flex justify-center items-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-[#fffaf0] w-[700px] max-w-full rounded-lg p-6 shadow-xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-lg font-bold text-[#6b4226] hover:text-black cursor-pointer"
          >
            <X size={24} />
          </button>

          {/* タイトル + アイコン */}
          <div className="flex items-center mb-6">
            <Coffee className="w-6 h-6 text-[#6b4226] mr-2" />
            <h2 className="text-xl font-bold text-[#6b4226]">マイカフェマップ一覧</h2>
          </div>

          <ul className="space-y-2 mb-4">
            {filteredMaps.map((map) => (
              <MapListItem
                key={map.id}
                map={map}
                selectedMapId={selectedMapId}
                onSelect={onSelectMap}
                onClose={onClose}
                setMapList={setMapList} 
                setSelectedMap={setSelectedMap}
              />
            ))}
          </ul>

          <button
            className="w-full py-3 bg-[#FFC800] hover:bg-[#D8A900] cursor-pointer text-black text-lg rounded-xl"
            onClick={() => setIsCreateModalOpen(true)} 
          >
            + 新しいカフェマップをつくる
          </button>
        </div>
      </div>
    </>
  );
};

export default MapListModal;
