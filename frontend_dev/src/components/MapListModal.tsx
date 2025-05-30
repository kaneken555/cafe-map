// components/MapListModal.tsx
import React, { useState } from "react";
import MapCreateModal from "./MapCreateModal"; 
// import { mockMapData } from "../api/mockMapData"; 
import CloseModalButton from "./CloseModalButton";
import MapListItem from "./MapListItem"; 
import ModalActionButton from "./ModalActionButton";
import SharedMapListItem from "./SharedMapListItem"; 
import SharedMapSearchModal from "./SharedMapSearchModal";
import { Coffee } from "lucide-react";
import { MapItem, SharedMapItem } from "../types/map";
import { toast } from "react-hot-toast";
import { extractUuidFromUrl } from "../utils/extractUuid";
import { searchSharedMap } from "../api/cafe";
import { MODAL_STYLES } from "../constants/ui";

// import { useAuth } from "../contexts/AuthContext";
import { useMap } from "../contexts/MapContext";
import { useCafe } from "../contexts/CafeContext"; // ✅ カフェコンテキストをインポート
import { useGroup } from "../contexts/GroupContext"; // ✅ グループコンテキストをインポート


interface MapListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMap: (map: MapItem) => void;
  selectedMapId: number | null;
  setShareUuid: React.Dispatch<React.SetStateAction<string | null>>; // ✅ シェアマップのUUIDをセットする関数
}

const MapListModal: React.FC<MapListModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelectMap, 
  selectedMapId, 
  setShareUuid, // ✅ シェアマップのUUIDをセットする関数
}) => {
  // const { user } = useAuth();
  const { mapList, sharedMapList, setMapMode } = useMap(); // ✅ コンテキストからマップリストとセット関数を取得
  const { setSharedMapCafeList} = useCafe(); // ✅ シェアマップのカフェリストとセット関数を取得
  const { selectedGroup } = useGroup(); // ✅ グループ情報を取得

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); 
  const [isSharedMapSearchOpen, setIsSharedMapSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'my' | 'shared'>('my');

  const filteredMaps = activeTab === "my" ? mapList : sharedMapList;

  // const filteredMaps = user
  // ? mockMapData.filter((map) => map.userId === user.id) // ✅ userId一致のみ
  // : []; // 未ログインなら空配列

  if (!isOpen) return null;


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
      setMapMode("share"); // ✅ マップモードをシェアに変更
      console.log("✅ 検索結果:", result);
      // TODO: setSelectedMap や setCafeList などに渡す処理を書く
      setIsSharedMapSearchOpen(false); // ここでモーダルを閉じる
      onClose(); // モーダル閉じる

    } catch (error) {
      toast.error("シェアマップの取得に失敗しました");
    }
  };

  return (
    <>
      {/* マップ作成モーダル */}
      <MapCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* // シェアマップ検索モーダル */}
      <SharedMapSearchModal
        isOpen={isSharedMapSearchOpen}
        onClose={() => setIsSharedMapSearchOpen(false)}
        onSearch={handleSearch}
      />

      {/* マップ一覧モーダル */}
      <div
        className={MODAL_STYLES.MAIN_MODAL.CONTAINER}
        onClick={onClose}
      >
        <div
          className="bg-[#fffaf0] w-[700px] max-w-full rounded-lg p-6 shadow-xl relative"
          onClick={(e) => e.stopPropagation()}
        >

          <CloseModalButton onClose={onClose} /> {/* ここで共通閉じるボタンを使う */}

          {/* タイトル + アイコン */}
          <div className="flex items-center mb-6">
            <Coffee className="w-6 h-6 text-[#6b4226] mr-2" />
            <h2 className="text-xl font-bold text-[#6b4226]">
              {selectedGroup ? "グループマップ一覧" : "マイカフェマップ一覧"}
            </h2>
          </div>

          {/* タブ切り替え */}
          <div className="flex space-x-2 mb-4">
            <button
              className={`px-3 py-1 rounded cursor-pointer ${activeTab === 'my' ? 'bg-green-100' : 'bg-gray-100'}`}
              onClick={() => setActiveTab('my')}
            >
              マイマップ
            </button>
            <button
              className={`px-3 py-1 rounded cursor-pointer ${activeTab === 'shared' ? 'bg-green-100' : 'bg-gray-100'}`}
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
                />
              ))}
              {activeTab === 'shared' &&
                (filteredMaps as SharedMapItem[]).map((map) => (
                  <SharedMapListItem
                    key={map.id}
                    map={map}
                    selectedMapId={selectedMapId}
                    onSelect={onSelectMap}
                    onClose={onClose}
                  />
                ))}
          </ul>

          {activeTab === "my" && (
            <ModalActionButton
              label={selectedGroup ? "+ 新しいグループマップをつくる" : "+ 新しいカフェマップをつくる"}
              onClick={() => setIsCreateModalOpen(true)}
            />
          )}
          {activeTab === "shared" && (
            <ModalActionButton
            label="🔍 シェアマップを開く"
            onClick={() => setIsSharedMapSearchOpen(true)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default MapListModal;
