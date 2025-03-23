import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MapCreateModal from "./MapCreateModal"; // マップ作成モーダルをインポート



interface MapListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMapSelect?: (map: Map) => void; // ← 追加
}


interface Map {
    id: number;
    name: string;
  }

const MapListModal: React.FC<MapListModalProps> = ({ isOpen, onClose, onMapSelect }) => {
    const [maps, setMaps] = useState<Map[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isMapCreateModalOpen, setIsMapCreateModalOpen] = useState<boolean>(false);
    const [selectedMap, setSelectedMap] = useState<Map | null>(null);


    // TODO:userId追加
    const fetchMaps = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/maps/`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("マップ一覧の取得に失敗しました");
        }
        const data: Map[] = await response.json();
        setMaps(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    };
  
    useEffect(() => {
      if (isOpen) {
        fetchMaps();
      }
    }, [isOpen]); // isOpenの変更時にも再取得
    
    const handleMapCreated = () => {
      fetchMaps(); // 新しいマップ作成後に再取得
      setIsMapCreateModalOpen(false); // モーダルを閉じる
    };

    const handleSelectMap = async (mapId: number) => {
      try {
        const response = await fetch(`http://localhost:8000/api/maps/${mapId}/`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("マップの取得に失敗しました");
        }
        const data = await response.json();
        setSelectedMap(data); // 状態として選択
        console.log("選択されたマップ:", data);
        if (onMapSelect) onMapSelect(data); // ← 親に渡す
        onClose(); // モーダルを閉じる（必要に応じて）
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        }
      }
    };

    const handleDeleteMap = async (mapId: number) => {
      console.log("Delete map ID:", mapId);
    };

      if (!isOpen) return null; // `isOpen` が false の場合は何もレンダリングしない
      
      return (
        <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>マップ一覧</h2>
          {error && <p className="error-text">{error}</p>}
          <ul>
        {maps.map((map) => (
          <li key={map.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span>{map.name}</span>
            <div>
              <button onClick={() => handleSelectMap(map.id)}>選択</button>
              <button onClick={() => handleDeleteMap(map.id)} style={{ marginLeft: '8px' }}>削除</button>
            </div>
          </li>
        ))}
          </ul>
          <button onClick={() => setIsMapCreateModalOpen(true)}>➕ マップ作成</button>
          <button onClick={onClose}>閉じる</button>
  
          {/* マップ作成モーダル */}
          {isMapCreateModalOpen && (
          <MapCreateModal
            isOpen={isMapCreateModalOpen}
            onClose={() => setIsMapCreateModalOpen(false)}
            onCreated={handleMapCreated} // 追加
          />
        )}
        </div>
      </div>
      );
    };
    
    export default MapListModal;