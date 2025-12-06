// components/Map.tsx
import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, TrafficLayer, TransitLayer, BicyclingLayer, Marker } from "@react-google-maps/api";
import MapButton from "../MapButton/MapButton";
import CafeOverlayIcon from "../CafeOverlayIcon/CafeOverlayIcon"; // ✅ 切り出したカフェアイコン表示用コンポーネント
import CustomPlaceOverlayIcon from "../CustomPlaceOverlayIcon/CustomPlaceOverlayIcon"; // ✅ カスタム地点アイコン表示用コンポーネント
import UnifiedPointOverlayIcon from "../UnifiedPointOverlayIcon/UnifiedPointOverlayIcon"; // ✅ 統合ポイント表示コンポーネント
import KeywordSearchModal from "../KeywordSearchModal/KeywordSearchModal"; // ✅ キーワード検索モーダルをインポート
import LoadingOverlay from "../LoadingOverlay/LoadingOverlay"; // ✅ ローディングオーバーレイコンポーネントをインポート
import { Cafe } from "../../types/cafe";
import { CustomPlace } from "../../types/customPlace"; // ✅ カスタム地点型をインポート
import { isCafePoint, isCustomPlacePoint } from "../../types/point"; // ✅ 統合ポイント型をインポート
import { convertCafeToCafePoint, convertCustomPlaceToCustomPlacePoint } from "../../utils/pointConverters"; // ✅ 型変換ユーティリティ
import { DEFAULT_CENTER, MAP_CONTAINER_STYLE, MAP_MODES } from "../../constants/map";
import { FEATURES } from "../../config/features"; // ✅ フィーチャーフラグ
import { useMap } from "../../contexts/MapContext";
import { useMapActions } from "../../hooks/useMapActions";
import { useCafeSearch } from "../../hooks/useCafeSearch"; // ✅ カフェ検索フックをインポート
import MapCustomizeModal from "../MapCustomizeModal/MapCustomizeModal";         // ★ 追加
import { MapDisplayOptions } from "../../types/mapDisplay";                     // ★ 追加
import lightJson from "../../assets/mapstyles/light.json";                     // ★ 追加
import darkJson from "../../assets/mapstyles/dark.json";                       // ★ 追加
import monoJson from "../../assets/mapstyles/mono.json";                       // ★ 追加
import { CustomApiClient } from "../../api/customApiClient"; // ✅ Custom APIクライアントをインポート
import type { Custom } from "../../types/custom"; // ✅ Custom型をインポート
import { Search, Settings, Loader2 } from "lucide-react"; // ✅ アイコンをインポート
import SearchSettingsModal from "../SearchSettingsModal/SearchSettingsModal"; // ✅ 検索設定モーダルをインポート

interface MapProps {
  cafes: Cafe[];
  onCafeIconClick: (cafe: Cafe) => void;
  selectedCafeId: number | null;
  setSelectedCafeId: (id: number | null) => void;
  setSearchResultCafes: (cafes: Cafe[]) => void; // ✅ 検索結果をセットする関数
  shareUuid: string | null; // ✅ シェアマップのUUIDをセットする関数
  customPlaces: CustomPlace[]; // ✅ カスタム地点の配列
  onCustomPlaceClick: (place: CustomPlace) => void; // ✅ カスタム地点クリック時のコールバック
  selectedCustomPlaceId: number | null; // ✅ 選択中のカスタム地点ID
  setSelectedCustomPlaceId: (id: number | null) => void; // ✅ カスタム地点IDをセットする関数
  isSelectingLocation?: boolean; // ✅ 位置選択モード
  onLocationSelected?: (lat: number, lng: number) => void; // ✅ 位置選択時のコールバック
  tempLocation?: { lat: number; lng: number } | null; // ✅ 仮の位置（ピン表示用）
  selectedMapId?: number | null; // ✅ カスタマイズ設定保存用のマップID
}


const Map: React.FC<MapProps> = ({
  cafes,
  onCafeIconClick,
  selectedCafeId,
  setSelectedCafeId,
  setSearchResultCafes,
  shareUuid,
  customPlaces,
  onCustomPlaceClick,
  selectedCustomPlaceId,
  setSelectedCustomPlaceId,
  isSelectingLocation = false,
  onLocationSelected,
  tempLocation,
  selectedMapId,
}) => {
  const { mapMode, selectedMap, setSelectedMap, setMapList, setMapMode } = useMap(); // ✅ setMapMode も取得
  const { registerSharedMap } = useMapActions();
  const { fetchCafes } = useCafeSearch(setSearchResultCafes);

  const [isMapLoading, setIsMapLoading] = useState(true);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [isKeywordSearchOpen, setIsKeywordSearchOpen] = useState(false); // モーダル開閉用

  // ★ カスタマイズモーダルの状態
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  // ✅ キーワード検索用のstate（インライン入力欄）
  const [keyword, setKeyword] = useState("");

  // ✅ 検索設定モーダルの状態
  const [isSearchSettingsOpen, setIsSearchSettingsOpen] = useState(false);

  // ✅ 検索中の状態
  const [isSearching, setIsSearching] = useState(false);

  // ✅ Custom適用後にselectedMapとmapListのcustom_idを更新
  const handleCustomApplied = (customId: number) => {
    if (selectedMap) {
      const updatedMap = { ...selectedMap, custom_id: customId };
      setSelectedMap(updatedMap);

      // mapListも更新して一貫性を保つ
      setMapList(prev =>
        prev.map(m => m.id === selectedMap.id ? updatedMap : m)
      );
    }
  };

  // ★ 表示オプション（最小セット）
  const [displayOptions, setDisplayOptions] = useState<MapDisplayOptions>({
    style: "default",
    iconVariant: "photo",
    iconColor: "#3B82F6", // ✅ デフォルトカラーを追加
    iconSize: 48, // ✅ デフォルトサイズを追加
    showLabels: false,
    layers: { traffic: false, transit: false, bicycling: false },
    clustering: false,
    heatmap: false,
  });

  // ✅ selectedMapのCustom設定を取得して反映
  useEffect(() => {
    const fetchAndApplyCustom = async () => {
      // マップが選択されていない、またはcustom_idがない場合はデフォルト設定にリセット
      if (!selectedMap || !selectedMap.custom_id) {
        console.log("✅ デフォルト設定にリセット");
        setDisplayOptions({
          style: "default",
          iconVariant: "photo",
          iconColor: "#3B82F6",
          iconSize: 48,
          showLabels: false,
          layers: { traffic: false, transit: false, bicycling: false },
          clustering: false,
          heatmap: false,
        });
        return;
      }

      try {
        const custom: Custom = await CustomApiClient.getCustomById(selectedMap.custom_id);
        console.log("✅ Custom設定を取得:", custom);

        // Custom設定をdisplayOptionsに反映
        setDisplayOptions((prev) => ({
          ...prev,
          style: custom.map_style,
          iconVariant: custom.icon_variant,
          iconColor: custom.icon_color,
          iconSize: custom.icon_size,
          showLabels: custom.show_labels,
        }));
      } catch (error) {
        console.error("❌ Custom設定の取得に失敗:", error);
        // エラー時はデフォルト設定にリセット
        setDisplayOptions({
          style: "default",
          iconVariant: "photo",
          iconColor: "#3B82F6",
          iconSize: 48,
          showLabels: false,
          layers: { traffic: false, transit: false, bicycling: false },
          clustering: false,
          heatmap: false,
        });
      }
    };

    fetchAndApplyCustom();
  }, [selectedMap?.id, selectedMap?.custom_id]); // マップIDとcustom_idが変更されたら再実行

  // ★ スタイルJSONは任意で差し替え（ここでは例として空配列＝デフォルト）
  const MAP_STYLES: Record<"default" | "light" | "dark" | "mono", google.maps.MapTypeStyle[] | undefined> = {
    default: [],  // ← これが「Google標準の地図」
    light: lightJson as unknown as google.maps.MapTypeStyle[],
    dark:  darkJson  as unknown as google.maps.MapTypeStyle[],
    mono:  monoJson  as unknown as google.maps.MapTypeStyle[],
  };

  // ✅ マップ中心の位置情報を取得する汎用関数
  const getMapCenter = (): { lat: number; lng: number } | null => {
    if (!mapRef.current) return null;
    const center = mapRef.current.getCenter();
    if (!center) return null;
    return {
      lat: center.lat(),
      lng: center.lng(),
    };
  };


  // ✅ インライン検索用のハンドラー（キーワードをstateから取得）
  const handleInlineKeywordSearch = async () => {
    console.log("📡 キーワード検索実行:", keyword);
    const center = getMapCenter();
    if (!center) return;

    setIsSearching(true);
    try {
      await fetchCafes(center, keyword); // キーワード検索
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeywordSearchClick = async (keyword: string) => {
    console.log("📡 キーワード検索実行:", keyword);
    const center = getMapCenter();
    if (!center) return;
    await fetchCafes(center, keyword); // キーワード検索
    setIsKeywordSearchOpen(false);
  };
  
  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const handleRegisterSharedMap = async () => {
    await registerSharedMap(shareUuid);
  }

  return (
    <div className="relative h-full w-full">
      {/* ✅ マップロード中だけオーバーレイ */}
      {isMapLoading && (
        <LoadingOverlay 
          loadingImageSrc="/loading.png"
          minDuration={2000}
          isActive={isMapLoading}
          onFinish={() => setIsMapLoading(false)}
        />
      )}

      {/* ✅ 新しいボタンレイアウト：[検索アイコン][キーワード入力欄][検索アイコン][設定][更新アイコン] */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center space-x-2 bg-white rounded-lg shadow-lg px-4 py-2">
        {/* 検索アイコン（装飾） */}
        {/* <Search className="w-5 h-5 text-gray-500" /> */}

        {/* キーワード入力欄 */}
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search keyword..."
          className="w-64 px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* 検索アイコンボタン（検索実行） */}
        <button
          onClick={handleInlineKeywordSearch}
          disabled={isSearching}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="キーワード検索を実行"
        >
          {isSearching ? (
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          ) : (
            <Search className="w-5 h-5 text-blue-600" />
          )}
        </button>

        {/* 検索設定ボタン */}
        <button
          onClick={() => setIsSearchSettingsOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-md transition-colors"
          aria-label="検索設定を開く"
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* ✅ マップモード切り替えトグル（検索モード/マイカフェモード時のみ表示） */}
      {mapMode !== MAP_MODES.share && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 flex items-center bg-white rounded-lg shadow-lg overflow-hidden">
          <button
            onClick={() => setMapMode(MAP_MODES.search)}
            className={`px-3 md:px-6 py-2 font-medium text-sm md:text-base whitespace-nowrap cursor-pointer transition-colors ${
              mapMode === MAP_MODES.search
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            検索結果
          </button>
          <button
            onClick={() => selectedMap && setMapMode(MAP_MODES.mycafe)}
            disabled={!selectedMap}
            className={`px-3 md:px-6 py-2 font-medium text-sm md:text-base whitespace-nowrap transition-colors ${
              mapMode === MAP_MODES.mycafe
                ? 'bg-blue-600 text-white cursor-pointer'
                : selectedMap
                ? 'bg-white text-gray-600 hover:bg-gray-50 cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            登録カフェ
          </button>
        </div>
      )}

      {/* ★ カスタマイズボタン（別の場所に配置） */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 z-10">
        <MapButton label="カスタマイズ" onClick={() => setIsCustomizeOpen(true)} />
      </div>

      {mapMode === MAP_MODES.share && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 flex space-x-4">
          <MapButton 
            label="シェアマップとして保存" 
            onClick={handleRegisterSharedMap}
            />
          <MapButton label="マイマップとして登録" onClick={() => alert("登録処理未実装")}/>
        </div>
      )}

      {isKeywordSearchOpen && (
        <KeywordSearchModal
          onClose={() => setIsKeywordSearchOpen(false)}
          onSearch={handleKeywordSearchClick}
        />
      )}

      {/* ★ カスタマイズモーダル */}
      {isCustomizeOpen && (
        <MapCustomizeModal
          value={displayOptions}
          onChange={setDisplayOptions}
          onClose={() => setIsCustomizeOpen(false)}
          selectedMapId={selectedMapId || selectedMap?.id} // ✅ propsのselectedMapIdを優先、なければコンテキストから取得
          onCustomApplied={handleCustomApplied} // ✅ Custom適用後のコールバックを渡す
          initialCustomId={selectedMap?.custom_id} // ✅ 初期選択するCustomIDを渡す
        />
      )}

      {/* ✅ 検索設定モーダル */}
      {isSearchSettingsOpen && (
        <SearchSettingsModal
          isOpen={isSearchSettingsOpen}
          onClose={() => setIsSearchSettingsOpen(false)}
        />
      )}

      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={DEFAULT_CENTER}
        zoom={15}
        onLoad={handleMapLoad}
        onUnmount={() => { mapRef.current = null; }}
        onClick={(e) => {
          // 位置選択モードの場合、クリック位置を親に通知
          if (isSelectingLocation && e.latLng && onLocationSelected) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            onLocationSelected(lat, lng);
          }
        }}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          ...(MAP_STYLES[displayOptions.style] ? { styles: MAP_STYLES[displayOptions.style] } : {}),
          // 位置選択モード時はカーソルを十字線に
          ...(isSelectingLocation ? { draggableCursor: 'crosshair' } : {}),
        }}
      >
        {/* レイヤー */}
        {displayOptions.layers.traffic && <TrafficLayer />}
        {displayOptions.layers.transit && <TransitLayer />}
        {displayOptions.layers.bicycling && <BicyclingLayer />}

        {/* 統合コンポーネント使用（オプション - フィーチャーフラグで制御可能） */}
        {FEATURES.USE_UNIFIED_POINTS_API ? (
          // 統合APIを使用する場合: UnifiedPointOverlayIconを使用
          <>
            {/* カフェを統合ポイントとして表示 */}
            {cafes.map((cafe) => {
              const point = convertCafeToCafePoint(cafe);
              return (
                <UnifiedPointOverlayIcon
                  key={`cafe-${cafe.id}`}
                  point={point}
                  isSelected={selectedCafeId === cafe.id}
                  showLabel={displayOptions.showLabels}
                  onClick={(point) => {
                    if (isCafePoint(point)) {
                      onCafeIconClick(cafe);
                      setSelectedCafeId(cafe.id);
                    }
                  }}
                />
              );
            })}

            {/* カスタム地点を統合ポイントとして表示 */}
            {customPlaces.map((place) => {
              const point = convertCustomPlaceToCustomPlacePoint(place);
              return (
                <UnifiedPointOverlayIcon
                  key={`custom-place-${place.id}`}
                  point={point}
                  isSelected={selectedCustomPlaceId === place.id}
                  showLabel={displayOptions.showLabels}
                  onClick={(point) => {
                    if (isCustomPlacePoint(point)) {
                      onCustomPlaceClick(place);
                      setSelectedCustomPlaceId(place.id);
                    }
                  }}
                />
              );
            })}
          </>
        ) : (
          // 既存API使用: 個別のコンポーネントを使用
          <>
            {/* カフェアイコン */}
            {cafes.map((cafe) => (
              <CafeOverlayIcon
                key={cafe.id}
                cafe={cafe}
                isSelected={selectedCafeId === cafe.id}
                showLabel={displayOptions.showLabels}         // ★ 反映
                variant={displayOptions.iconVariant}          // ★ 反映（コンポーネント側対応）
                color={displayOptions.iconColor} // ✅ カラー反映
                size={displayOptions.iconSize} // ✅ 追加！
                onClick={() => {
                  onCafeIconClick(cafe);
                  setSelectedCafeId(cafe.id);
                }}
              />
            ))}

            {/* ✅ カスタム地点アイコン */}
            {customPlaces.map((place) => (
              <CustomPlaceOverlayIcon
                key={place.id}
                place={place}
                isSelected={selectedCustomPlaceId === place.id}
                showLabel={displayOptions.showLabels}
                onClick={(place) => {
                  onCustomPlaceClick(place);
                  setSelectedCustomPlaceId(place.id);
                }}
              />
            ))}
          </>
        )}

        {/* ✅ 仮ピン表示（位置選択時） */}
        {tempLocation && (
          <Marker
            position={{ lat: tempLocation.lat, lng: tempLocation.lng }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#4285F4',
              fillOpacity: 0.8,
              strokeColor: '#ffffff',
              strokeWeight: 2,
            }}
            animation={google.maps.Animation.DROP}
          />
        )}

        {/* TODO:
            displayOptions.clustering → MarkerClusterer に切替
            displayOptions.heatmap    → HeatmapLayer 追加
         */}
      </GoogleMap>
    </div>
  );
};

export default Map;
