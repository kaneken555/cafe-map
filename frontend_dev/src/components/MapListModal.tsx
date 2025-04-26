// components/MapListModal.tsx
import React, { useState } from "react";
import MapCreateModal from "./MapCreateModal"; // ← 追加
import { mockMapData, MapItem } from "../api/mockMapData"; // ✅ 追加

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectMap: (map: MapItem) => void;
  selectedMapId: number | null; // 👈 追加
  user: { id: number; name: string } | null; // 👈 追加
}

const MapListModal: React.FC<Props> = ({ isOpen, onClose, onSelectMap, selectedMapId, user }) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // ← 追加
  const filteredMaps = user
  ? mockMapData.filter((map) => map.userId === user.id) // ✅ userId一致のみ
  : []; // 未ログインなら空配列

  if (!isOpen) return null;


  return (
    <>
      {/* マップ作成モーダル */}
      <MapCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
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
              <li
                key={map.id}
                className="flex justify-between items-center border px-4 py-2 rounded"
              >
                <span className="truncate">{map.name}</span>
                <div className="flex space-x-2">
                {map.id === selectedMapId ? (
                  <span className="text-sm text-white bg-green-500 px-2 py-1 rounded">
                    選択中
                  </span>
                ) : (
                  <button
                    className="text-sm text-white bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded"
                    onClick={() => {
                      onSelectMap(map);
                      onClose();
                    }}
                  >
                    選択
                  </button>
                )}
                  <button className="text-sm text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded">
                    削除
                  </button>
                </div>
              </li>
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
