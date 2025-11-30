// pages/HomePage.tsx
import React, { useState, useEffect } from "react";

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
import ChatFAB from "../components/ChatFAB/ChatFAB"; // ✅ チャットFAB
import ChatPanel from "../components/ChatPanel/ChatPanel"; // ✅ チャットパネル
import ChatUI from "../components/ChatUI/ChatUI"; // ✅ チャットUI
import { AddActionFAB } from "../components/AddActionFAB"; // ✅ AddActionFAB
import { CustomPlaceFormModal } from "../components/CustomPlaceFormModal"; // ✅ カスタム地点登録フォーム
import CustomPlaceDetailPanel from "../components/CustomPlaceDetailPanel/CustomPlaceDetailPanel"; // ✅ カスタム地点詳細パネル

import { MAP_MODES } from "../constants/map";
import { MapItem, SharedMapItem } from "../types/map";
import { CustomPlace } from "../types/customPlace"; // ✅ CustomPlace型
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
// Services
import { getCustomPlacesByMap, deleteCustomPlace } from "../services/customPlaceService"; // ✅ カスタム地点取得サービス


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
  const [isChatOpen, setIsChatOpen] = useState(false); // ✅ チャットパネルの表示
  const [customPlaces, setCustomPlaces] = useState<CustomPlace[]>([]); // ✅ カスタム地点
  const [selectedCustomPlaceId, setSelectedCustomPlaceId] = useState<number | null>(null); // ✅ 選択中のカスタム地点ID
  const [selectedCustomPlace, setSelectedCustomPlace] = useState<CustomPlace | null>(null); // ✅ 選択中のカスタム地点
  const [isCustomPlaceFormOpen, setIsCustomPlaceFormOpen] = useState(false); // ✅ カスタム地点登録フォーム表示
  const [customPlaceInitialLocation, setCustomPlaceInitialLocation] = useState<{ lat: number; lng: number } | undefined>(undefined); // ✅ カスタム地点の初期位置

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

  // ✅ カスタム地点を取得するuseEffect
  useEffect(() => {
    const fetchCustomPlaces = async () => {
      if (selectedMap?.id && mapMode === MAP_MODES.mycafe) {
        try {
          const response = await getCustomPlacesByMap(selectedMap.id);
          setCustomPlaces(response.custom_places);
        } catch (error) {
          console.error("カスタム地点の取得に失敗しました:", error);
          setCustomPlaces([]);
        }
      } else {
        setCustomPlaces([]);
      }
    };

    fetchCustomPlaces();
  }, [selectedMap?.id, mapMode]);

  // ✅ カスタム地点クリックハンドラー
  const handleCustomPlaceClick = (place: CustomPlace) => {
    console.log("カスタム地点がクリックされました:", place);
    setSelectedCustomPlace(place);
    setSelectedCustomPlaceId(place.id);
  };

  // ✅ カスタム地点登録成功時のハンドラー
  const handleCustomPlaceSuccess = async () => {
    // カスタム地点を再取得
    if (selectedMap?.id) {
      try {
        const response = await getCustomPlacesByMap(selectedMap.id);
        setCustomPlaces(response.custom_places);
      } catch (error) {
        console.error("カスタム地点の再取得に失敗しました:", error);
      }
    }
  };

  // ✅ カスタム地点削除ハンドラー
  const handleCustomPlaceDelete = async (place: CustomPlace) => {
    if (!window.confirm(`「${place.name}」を削除してもよろしいですか？`)) {
      return;
    }

    try {
      await deleteCustomPlace(place.id);
      setSelectedCustomPlace(null);
      setSelectedCustomPlaceId(null);

      // カスタム地点を再取得
      if (selectedMap?.id) {
        const response = await getCustomPlacesByMap(selectedMap.id);
        setCustomPlaces(response.custom_places);
      }
    } catch (error) {
      console.error("カスタム地点の削除に失敗しました:", error);
      alert("カスタム地点の削除に失敗しました");
    }
  };

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
          customPlaces={customPlaces} // ✅ カスタム地点を渡す
          onCustomPlaceClick={handleCustomPlaceClick} // ✅ カスタム地点クリックハンドラーを渡す
          selectedCustomPlaceId={selectedCustomPlaceId} // ✅ 選択中のカスタム地点IDを渡す
          setSelectedCustomPlaceId={setSelectedCustomPlaceId} // ✅ カスタム地点ID設定関数を渡す
        />
      </div>

      <FooterActions
        onOpenCafeList={handleOpenCafeList}
        onOpenMapList={handleOpenMapList} // ✅ 同じ関数を再利用
        isMyCafeListOpen={isMyCafeListOpen}
      />

      {/* ✅ AddActionFAB（マップ作成 + カスタム地点登録） */}
      <AddActionFAB
        onCreateMap={() => setIsMapCreateOpen(true)}
        onAddCustomPlace={() => {
          setCustomPlaceInitialLocation(undefined); // 初期位置なし（フォームでマップ中心座標を使用）
          setIsCustomPlaceFormOpen(true);
        }}
        isMapSelected={!!selectedMap}
      />

      {/* ✅ カスタム地点登録フォームモーダル */}
      <CustomPlaceFormModal
        isOpen={isCustomPlaceFormOpen}
        onClose={() => setIsCustomPlaceFormOpen(false)}
        onSuccess={handleCustomPlaceSuccess}
        initialLocation={customPlaceInitialLocation}
        availableMaps={selectedMap ? [selectedMap] : []}
        defaultMapId={selectedMap?.id}
      />

      {/* ✅ カスタム地点詳細パネル */}
      <CustomPlaceDetailPanel
        customPlace={selectedCustomPlace}
        onClose={() => {
          setSelectedCustomPlace(null);
          setSelectedCustomPlaceId(null);
        }}
        onEdit={() => {
          // TODO: 編集機能は次のフェーズで実装
          alert('編集機能は準備中です');
        }}
        onDelete={handleCustomPlaceDelete}
      />

      {/* チャットFAB */}
      <ChatFAB
        onClick={() => setIsChatOpen(!isChatOpen)}
        isOpen={isChatOpen}
      />

      {/* チャットパネル */}
      <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)}>
        <ChatUI />
      </ChatPanel>

    </div>
  );
};

export default HomePage;
