// components/MapListModal.tsx
import React, { useState } from "react";
import MapCreateModal from "./MapCreateModal"; 
import { mockMapData, MapItem } from "../api/mockMapData"; 
import MapListItem from "./MapListItem"; 

interface MapListModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onSelectMap: (map: MapItem) => void;
  onSelectMap: (map: { id: number; name: string }) => void;
  selectedMapId: number | null; // 👈 追加
  mapList: { id: number; name: string }[];
  setMapList: React.Dispatch<React.SetStateAction<{ id: number; name: string }[]>>; 
  user: { id: number; name: string } | null; 
}

const MapListModal: React.FC<MapListModalProps> = ({ isOpen, onClose, onSelectMap, selectedMapId, mapList, setMapList, user }) => {
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
          className="bg-white w-[700px] max-w-full rounded-lg p-6 shadow-xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-2 right-3 text-lg font-bold text-gray-600 hover:text-black"
          >
            ×
          </button>

          <h2 className="text-xl font-bold mb-4 text-center">マップ一覧</h2>

          <ul className="space-y-2 mb-4">
            {filteredMaps.map((map) => (
              <MapListItem
                key={map.id}
                map={map}
                selectedMapId={selectedMapId}
                onSelect={onSelectMap}
                onClose={onClose}
              />
            ))}
          </ul>

          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setIsCreateModalOpen(true)} // ← ここで表示
          >
            + 新規マップを作成
          </button>
        </div>
      </div>
    </>
  );
};

export default MapListModal;
