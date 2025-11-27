// pages/HomePage.tsx
import React, { useState } from "react";

// Components
import CafeDetailPanel from "../components/CafeDetailPanel/CafeDetailPanel";
import CafeMapAssignModal from "../components/CafeMapAssignModal/CafeMapAssignModal"; // ✅ カフェマップアサインモーダル
import FooterActions from "../components/FooterActions/FooterActions"; // ✅ 追加
import Header from "../components/Header/Header";
import Map from "../components/Map/Map";
import MapCreateModal from "../components/MapCreateModal/MapCreateModal"; // ✅ マップ作成モーダル
import MapListModal from "../components/MapListModal/MapListModal";
import MyCafeListPanel from "../components/MyCafeListPanel/MyCafeListPanel"; // ✅ カフェ一覧パネル
import SearchResultPanel from "../components/SearchResultPanel/SearchResultPanel";

import { MAP_MODES } from "../constants/map";
import { MapItem, SharedMapItem } from "../types/map";
// Contexts
import { useCafe } from "../contexts/CafeContext";
import { useMap } from "../contexts/MapContext";
// Hooks
import { useHeaderActions } from "../hooks/useHeaderActions"; // ✅ ヘッダーアクションフックをインポート
import { useCafeMapModals } from "../hooks/useCafeMapModals"; // ✅ カフェマップモーダルフックをインポート
import { useCafeMapAssign } from "../hooks/useCafeMapAssign"; // ✅ カフェマップアサインフックをインポート
import { useMapActions } from "../hooks/useMapActions"; // ✅ マップアクションフックをインポート
// Utils
import { requireMapSelected } from "../utils/mapUtils";


const HomePage: React.FC = () => {
  // コンテキストから必要な値を取得
  const { myCafeList, setMyCafeList, sharedMapCafeList,
    selectedSearchedCafe, setSelectedSearchedCafe,
    searchResultCafes, setSearchResultCafes,
    selectedRegisteredCafe, setSelectedRegisteredCafe,
   } = useCafe(); // カフェコンテキストからcafeListとsetCafeListを取得
  const { selectedMap, mapMode } = useMap(); // マップコンテキストからmapModeを取得

  const {
    isCafeMapAssignModalOpen, openCafeMapAssignModal, closeCafeMapAssignModal,
  } = useCafeMapModals();

  // 状態管理
  const [selectedCafeId, setSelectedCafeId] = useState<number | null>(null);
  const [selectedMapId, setSelectedMapId] = useState<number | null>(selectedMap?.id ?? null);
  const [isMyCafeListOpen, setIsMyCafeListOpen] = useState(false); // ✅ カフェ一覧パネルの表示
  const [isSearchResultOpen, setIsSearchResultOpen] = useState(false); // ✅ 検索パネル表示用
  const [shareUuid, setShareUuid] = useState<string | null>(null);
  const [isMapListOpen, setIsMapListOpen] = useState(false); // ✅ mapモーダル状態
  const [isMapCreateOpen, setIsMapCreateOpen] = useState(false); // ✅ マップ作成モーダル状態

  const { handleAddToMaps } = useCafeMapAssign(
    selectedSearchedCafe || selectedRegisteredCafe,
    setMyCafeList
  );

  const { createNewMap } = useMapActions(); // ✅ マップアクションフックからマップ作成関数を取得

  const closeCafeListPanel = () => {
    setIsMyCafeListOpen(false)
  }

  const {
    mapSelectHandler,
    sharedMapSelectHandler,
  } = useHeaderActions({ closeCafeListPanel, setShareUuid });


  const handleOpenMapList = () => {
    setIsMapListOpen(true);
  }
    
  const handleMapSelect = async (map: MapItem) => {
    await mapSelectHandler(map); // ✅ ヘッダーアクションフックのマップ選択ハンドラを呼び出す
    setIsMapListOpen(false);
  }

  const handleSharedMapSelect = async (map: SharedMapItem) => {
    await sharedMapSelectHandler(map); // ✅ ヘッダーアクションフックのシェアマップ選択ハンドラを呼び出す
    setIsMapListOpen(false);
  }

  const handleOpenCafeList = () =>
    requireMapSelected(selectedMap, () => setIsMyCafeListOpen(true));


  return (
    <div className="flex flex-col fixed inset-0 overflow-hidden">
      <Header
        closeCafeListPanel={() => setIsMyCafeListOpen(false)}
        isMyCafeListOpen={isMyCafeListOpen}
        setShareUuid={setShareUuid} // ✅ シェアマップのUUIDをセットする関数
        onOpenCafeList={handleOpenCafeList}
        onOpenMapList={handleOpenMapList} // ✅ 共通の関数を渡す
      />
      {/* マイカフェ一覧パネル */}
      <MyCafeListPanel
        isOpen={isMyCafeListOpen}
        onClose={() => setIsMyCafeListOpen(false)}
        cafes={myCafeList}
        onCafeClick={(cafe) => {
          setSelectedRegisteredCafe(cafe); // ✅ 選択カフェセット
          setSelectedCafeId(cafe.id); // ✅ 選択IDセット（今後何かに使う用？）
        }}
      />

      <MapListModal
          isOpen={isMapListOpen}
          onClose={() => setIsMapListOpen(false)}
          onSelectMap={handleMapSelect}
          onSelectSharedMap={handleSharedMapSelect} // ✅ シェアマップ選択ハンドラを追加
          selectedMapId={selectedMapId}
          setSelectedMapId={setSelectedMapId}
          setShareUuid={setShareUuid} // ✅ シェアマップのUUIDをセットする関数
        />

      {/* ✅ マップ作成モーダル */}
      <MapCreateModal
        isOpen={isMapCreateOpen}
        onClose={() => setIsMapCreateOpen(false)}
        createMap={createNewMap}
      />

      {/* 検索結果パネル */}
      <SearchResultPanel
        isOpen={isSearchResultOpen}
        onClose={() => setIsSearchResultOpen(false)}
        cafes={searchResultCafes}
        onCafeClick={(cafe) => {
          setSelectedSearchedCafe(cafe);
          setSelectedCafeId(cafe.id);
        }}
      />

      {/* カフェ詳細パネル */}
      <CafeDetailPanel
        cafe={selectedSearchedCafe || selectedRegisteredCafe}
        onClose={() => {
          setSelectedSearchedCafe(null);
          setSelectedRegisteredCafe(null);
          setSelectedCafeId(null);
        }}
        onAddCafeToMapClick={openCafeMapAssignModal} // ✅ useCafeMapModalsから取得した関数
      />

      <CafeMapAssignModal
        isOpen={isCafeMapAssignModalOpen}
        onClose={closeCafeMapAssignModal}
        initialSelectedMap={selectedMap}
        onAdd={handleAddToMaps}
      />

      {/* Map */}
      <div className="flex-grow pb-14 md:pb-0">
        <Map
          cafes={
            mapMode === MAP_MODES.mycafe
              ? myCafeList
              : mapMode === MAP_MODES.share
              ? sharedMapCafeList
              : searchResultCafes
          }
          onCafeIconClick={(cafe) => {
            if (mapMode === MAP_MODES.mycafe || mapMode === MAP_MODES.share) {
              setSelectedRegisteredCafe(cafe);
            } else {
              setSelectedSearchedCafe(cafe);
            }
          }}
          selectedCafeId={selectedCafeId}
          setSelectedCafeId={setSelectedCafeId}
          setSearchResultCafes={(cafes) => {
            setSearchResultCafes(cafes);
            setIsSearchResultOpen(true); // ✅ 検索結果パネル表示
          }}
          shareUuid={shareUuid} // ✅ シェアマップのUUIDを渡す
          onCreateMapClick={() => setIsMapCreateOpen(true)} // ✅ マップ作成ボタンクリック時の処理
        />
      </div>

      <FooterActions
        onOpenCafeList={handleOpenCafeList}
        onOpenMapList={handleOpenMapList} // ✅ 同じ関数を再利用
        isMyCafeListOpen={isMyCafeListOpen}
      />

    </div>
  );
};

export default HomePage;
