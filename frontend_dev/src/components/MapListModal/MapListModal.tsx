// components/MapListModal.tsx
import React, { useState } from "react";
import clsx from "clsx";

import MapCreateModal from "../MapCreateModal/MapCreateModal"; 
// import { mockMapData } from "../api/mockMapData"; 
import MapListItem from "../MapListItem/MapListItem"; 
import MapDeleteModal from "../MapDeleteModal/MapDeleteModal";
import MapDetailModal from "../MapDetailModal/MapDetailModal";
import BaseModal from "../BaseModal/BaseModal";

import ModalActionButton from "../ModalActionButton/ModalActionButton";
import SharedMapListItem from "../SharedMapListItem/SharedMapListItem"; 
import SharedMapSearchModal from "../SharedMapSearchModal/SharedMapSearchModal";
import { Coffee } from "lucide-react";
import { Cafe } from "../../types/cafe";
import { MapItem, SharedMapItem } from "../../types/map";
import { toast } from "react-hot-toast";
import { extractUuidFromUrl } from "../../utils/extractUuid";
import { getCafeList, searchSharedMap } from "../../services/cafeService";
import { updateMapInfo } from "../../services/mapService"; // ✅ マップ情報更新のAPIをインポート

import { useMap } from "../../contexts/MapContext";
import { useCafe } from "../../contexts/CafeContext"; // ✅ カフェコンテキストをインポート
import { useGroup } from "../../contexts/GroupContext"; // ✅ グループコンテキストをインポート

import { MAP_MODES } from "../../constants/map";

import { useMapModals } from "../../hooks/useMapModals";
import { useMapActions } from "../../hooks/useMapActions";


interface MapListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMap: (map: MapItem) => void;
  onSelectSharedMap: (map: SharedMapItem) => void; // ✅ シェアマップ選択時のコールバック
  selectedMapId: number | null;
  setSelectedMapId: (id: number | null) => void; // ✅ これを追加
  setShareUuid: React.Dispatch<React.SetStateAction<string | null>>; // ✅ シェアマップのUUIDをセットする関数
}

const MapListModal: React.FC<MapListModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectMap, 
  onSelectSharedMap, // ✅ シェアマップ選択時のコールバック
  selectedMapId, 
  setSelectedMapId,
  setShareUuid, // ✅ シェアマップのUUIDをセットする関数
}) => {
  const { mapList, setMapList, sharedMapList, setMapMode } = useMap(); // ✅ コンテキストからマップリストとセット関数を取得
  const { setSharedMapCafeList} = useCafe(); // ✅ シェアマップのカフェリストとセット関数を取得
  const { selectedGroup } = useGroup(); // ✅ グループ情報を取得

  const mapModals = useMapModals(); // ✅ ここで useMapModals を呼ぶ
  const { 
    isCreateModalOpen, openCreateModal, closeCreateModal,
    isSharedMapSearchOpen, openSharedMapSearch, closeSharedMapSearch,
    isDeleteModalOpen, openDeleteModal, closeDeleteModal,
    isDetailModalOpen, openDetailModal, closeDetailModal,
  } = mapModals;

  const { createNewMap, deleteMapById, checkShareStatus, selectMap  } = useMapActions(); // ✅ カスタムフックから取得

  const [selectedMapForDelete, setSelectedMapForDelete] = useState<MapItem | null>(null);
  const [selectedMapForDetail, setSelectedMapForDetail] = useState<MapItem | null>(null); // ✅ 詳細用
  const [cafesForDetail, setCafesForDetail] = useState<Cafe[]>([]);
  const [activeTab, setActiveTab] = useState<'my' | 'shared'>('my');

  const filteredMaps = activeTab === "my" ? mapList : sharedMapList;

  // const filteredMaps = user
  // ? mockMapData.filter((map) => map.userId === user.id) // ✅ userId一致のみ
  // : []; // 未ログインなら空配列


  const handleSearch = async (input: string) => {
    const uuid = extractUuidFromUrl(input);
    if (!uuid) {
      toast.error("有効な招待URLを入力してください");
      return;
    }
    setShareUuid(uuid); // ✅ UUIDをセット
  
    try {
      const result = await searchSharedMap(uuid); // ✅ データ取得
      if (!result) {
        toast.error("シェアマップが見つかりません");
        return;
      }
  
      // ✅ 検索成功 → カフェ情報取得 & マップ表示
      setSharedMapCafeList(result);
      setMapMode(MAP_MODES.search); // ✅ マップモードをシェアに変更
      console.log("✅ 検索結果:", result);
      // TODO: setSelectedMap や setCafeList などに渡す処理を書く
      closeSharedMapSearch();
      onClose(); // モーダル閉じる

    } catch (error) {
      toast.error("シェアマップの取得に失敗しました");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    await deleteMapById(id, name);
  };
  
  const handleShare = async (id: number): Promise<string | null> => {
    return await checkShareStatus(id);
  };
  
  const handleSelectMap = (map: MapItem, onSelect: any, onClose: any) => {
    selectMap(map, onSelect, onClose);
  };

  const handleDeleteClick = (map: MapItem) => {
    setSelectedMapForDelete(map);
    openDeleteModal();
  };

  const handleDetail = async (map: MapItem) => {
    setSelectedMapForDetail(map);
    const cafes = await getCafeList(map.id);
    console.log("📡 カフェ一覧取得:", cafes);
    setCafesForDetail(cafes);
    openDetailModal();
  };

  return (
    <>
      {/* マップ作成モーダル */}
      <MapCreateModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        createMap={createNewMap}
      />

      <MapDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          closeDeleteModal();
          setSelectedMapForDelete(null);
          setCafesForDetail([]);
        }}
        onConfirm={async () => {
          if (selectedMapForDelete) {
            await handleDelete(selectedMapForDelete.id, selectedMapForDelete.name);
            setSelectedMapId(null); // ✅ 削除後に id をリセット
          }
          setSelectedMapForDelete(null);
          closeDeleteModal();
        }}
        mapName={selectedMapForDelete?.name ?? ""}
      />

      <MapDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          closeDetailModal();
          setSelectedMapForDetail(null);
        }}
        map={selectedMapForDetail}
        cafes={cafesForDetail}
        onUpdateMap={async (updatedMap) => {
          const res = await updateMapInfo(updatedMap.id, {
            name: updatedMap.name,
            description: updatedMap.description,
          });
          setSelectedMapForDetail(res);
          setMapList(prev => prev.map(m => m.id === res.id ? res : m));
        }}
      />

      {/* // シェアマップ検索モーダル */}
      <SharedMapSearchModal
        isOpen={isSharedMapSearchOpen}
        onClose={closeSharedMapSearch}
        onSearch={handleSearch}
      />

      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title={selectedGroup ? "グループマップ一覧" : "マイカフェマップ一覧"}
        icon={<Coffee className="w-6 h-6 text-[#6b4226]" />}
        size="lg"
      >

        {/* タブ切り替え */}
        <div className="flex space-x-2 mb-4">
          <button
            className={clsx(
              "px-3 py-1 rounded cursor-pointer",
              activeTab === "my" ? "bg-green-100" : "bg-gray-100"
            )}
            onClick={() => setActiveTab('my')}
          >
            マイマップ
          </button>
          <button
            className={clsx(
              "px-3 py-1 rounded cursor-pointer",
              activeTab === "shared" ? "bg-green-100" : "bg-gray-100"
            )}
            onClick={() => setActiveTab('shared')}
          >
            シェアマップ
          </button>
        </div>

        <ul className="space-y-2 mb-4 max-h-[400px] overflow-y-auto">
          {activeTab === 'my' &&
            filteredMaps.map((map) => (
              <MapListItem
                key={map.id}
                map={map}
                selectedMapId={selectedMapId}
                onSelect={onSelectMap}
                onClose={onClose}
                onDeleteClick={handleDeleteClick}
                mapModals={mapModals}
                onShare={handleShare}
                onSelectMap={handleSelectMap}
                onDetailClick={handleDetail} // ✅ 詳細表示用の関数
              />
            ))}
            {activeTab === 'shared' &&
              (filteredMaps as SharedMapItem[]).map((map) => (
                <SharedMapListItem
                  key={map.id}
                  map={map}
                  selectedMapId={selectedMapId}
                  onSelect={onSelectSharedMap}
                  onClose={onClose}
                  mapModals={mapModals}
                />
              ))}
        </ul>

        {activeTab === "my" && (
          <ModalActionButton
            label={selectedGroup ? "+ 新しいグループマップをつくる" : "+ 新しいカフェマップをつくる"}
            onClick={openCreateModal}
          />
        )}
        {activeTab === "shared" && (
          <ModalActionButton
          label="🔍 シェアマップを開く"
          onClick={openSharedMapSearch}
          />
        )}

      </BaseModal>
    </>
  );
};

export default MapListModal;
