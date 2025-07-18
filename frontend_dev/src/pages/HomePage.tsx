// pages/HomePage.tsx
import React, { useState } from "react";

// Components
import CafeDetailPanel from "../components/CafeDetailPanel/CafeDetailPanel";
import CafeMapAssignModal from "../components/CafeMapAssignModal/CafeMapAssignModal"; // ✅ カフェマップアサインモーダル
import FooterActions from "../components/FooterActions/FooterActions"; // ✅ 追加
import Header from "../components/Header";
import Map from "../components/Map";
import MapListModal from "../components//MapListModal";
import MyCafeListPanel from "../components/MyCafeListPanel/MyCafeListPanel"; // ✅ カフェ一覧パネル
import SearchResultPanel from "../components/SearchResultPanel/SearchResultPanel";

import { Cafe, mockSearchResults } from "../api/mockCafeData"; // ✅ Cafe型をインポート
import { MAP_MODES } from "../constants/map";
import { MapItem, SharedMapItem } from "../types/map";
// Contexts
import { useCafe } from "../contexts/CafeContext";
import { useMap } from "../contexts/MapContext";
// Hooks
import { useHeaderActions } from "../hooks/useHeaderActions"; // ✅ ヘッダーアクションフックをインポート
import { useCafeMapModals } from "../hooks/useCafeMapModals"; // ✅ カフェマップモーダルフックをインポート
import { useCafeMapAssign } from "../hooks/useCafeMapAssign"; // ✅ カフェマップアサインフックをインポート
// Utils
import { requireMapSelected } from "../utils/mapUtils";


const HomePage: React.FC = () => {
  // コンテキストから必要な値を取得
  const { cafeList, myCafeList, setMyCafeList, sharedMapCafeList } = useCafe(); // カフェコンテキストからcafeListとsetCafeListを取得
  const { selectedMap, mapMode, setMapMode } = useMap(); // マップコンテキストからmapModeとsetMapModeを取得

  const {
    isCafeMapAssignModalOpen, openCafeMapAssignModal, closeCafeMapAssignModal,
  } = useCafeMapModals();
  
  // 状態管理
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null); // ✅ カフェ詳細
  const [selectedCafeId, setSelectedCafeId] = useState<number | null>(null);
  const [selectedMapId, setSelectedMapId] = useState<number | null>(selectedMap?.id ?? null);
  const [isMyCafeListOpen, setIsMyCafeListOpen] = useState(false); // ✅ カフェ一覧パネルの表示
  const [searchResultCafes, setSearchResultCafes] = useState<Cafe[]>(mockSearchResults); // 検索結果
  const [isSearchResultOpen, setIsSearchResultOpen] = useState(false); // ✅ 検索パネル表示用
  const [shareUuid, setShareUuid] = useState<string | null>(null);
  const [isMapListOpen, setIsMapListOpen] = useState(false); // ✅ mapモーダル状態

  const { handleAddToMaps } = useCafeMapAssign(selectedCafe, setMyCafeList);

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
  
  const handleShowMyCafeMap = () =>
    requireMapSelected(selectedMap, () => setMapMode(MAP_MODES.mycafe));


  return (
    <div className="flex flex-col h-screen w-full">
      <Header
        closeCafeListPanel={() => setIsMyCafeListOpen(false)}
        isMyCafeListOpen={isMyCafeListOpen}
        setShareUuid={setShareUuid} // ✅ シェアマップのUUIDをセットする関数
        onOpenCafeList={handleOpenCafeList}
        onShowMyCafeMap={handleShowMyCafeMap} // ✅ 追加
        onOpenMapList={handleOpenMapList} // ✅ 共通の関数を渡す
      />
      {/* マイカフェ一覧パネル */}
      <MyCafeListPanel
        isOpen={isMyCafeListOpen}
        onClose={() => setIsMyCafeListOpen(false)}
        cafes={cafeList}
        onCafeClick={(cafe) => {
          setSelectedCafe(cafe); // ✅ 選択カフェセット
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

      {/* 検索結果パネル */}
      <SearchResultPanel
        isOpen={isSearchResultOpen}
        onClose={() => setIsSearchResultOpen(false)}
        cafes={searchResultCafes}
        onCafeClick={(cafe) => {
          setSelectedCafe(cafe);
          setSelectedCafeId(cafe.id);
        }}
      />

      {/* カフェ詳細パネル */}
      <CafeDetailPanel
        cafe={selectedCafe}
        onClose={() => {
          setSelectedCafe(null);
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
      <div className="flex-grow">
        <Map 
          cafes={
            mapMode === MAP_MODES.mycafe
              ? myCafeList
              : mapMode === MAP_MODES.share
              ? sharedMapCafeList
              : searchResultCafes
          }          
          onCafeIconClick={(cafe) => setSelectedCafe(cafe)} 
          selectedCafeId={selectedCafeId}
          setSelectedCafeId={setSelectedCafeId}
          setSearchResultCafes={(cafes) => {
            setSearchResultCafes(cafes);
            setIsSearchResultOpen(true); // ✅ 検索結果パネル表示
          }}
          shareUuid={shareUuid} // ✅ シェアマップのUUIDを渡す
        />
      </div>

      <FooterActions
        onOpenCafeList={handleOpenCafeList}
        onOpenMapList={handleOpenMapList} // ✅ 同じ関数を再利用
        onShowMyCafeMap={handleShowMyCafeMap} // ✅ 追加
        isMyCafeListOpen={isMyCafeListOpen}
      />

    </div>
  );
};

export default HomePage;
