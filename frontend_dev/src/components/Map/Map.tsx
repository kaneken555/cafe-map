// components/Map.tsx
import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, TrafficLayer, TransitLayer, BicyclingLayer } from "@react-google-maps/api";
import MapButton from "../MapButton/MapButton";
import CafeOverlayIcon from "../CafeOverlayIcon/CafeOverlayIcon"; // ✅ 切り出したカフェアイコン表示用コンポーネント
import KeywordSearchModal from "../KeywordSearchModal/KeywordSearchModal"; // ✅ キーワード検索モーダルをインポート
import LoadingOverlay from "../LoadingOverlay/LoadingOverlay"; // ✅ ローディングオーバーレイコンポーネントをインポート
import { Cafe } from "../../types/cafe";
import { DEFAULT_CENTER, MAP_CONTAINER_STYLE, MAP_MODES } from "../../constants/map";
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

interface MapProps {
  cafes: Cafe[];
  onCafeIconClick: (cafe: Cafe) => void;
  selectedCafeId: number | null; 
  setSelectedCafeId: (id: number | null) => void; 
  setSearchResultCafes: (cafes: Cafe[]) => void; // ✅ 検索結果をセットする関数
  shareUuid: string | null; // ✅ シェアマップのUUIDをセットする関数
}


const Map: React.FC<MapProps> = ({
  cafes,
  onCafeIconClick,
  selectedCafeId,
  setSelectedCafeId,
  setSearchResultCafes,
  shareUuid
}) => {
  const { mapMode, selectedMap, setSelectedMap, setMapList } = useMap(); // ✅ setMapListも取得
  const { registerSharedMap } = useMapActions();
  const { fetchCafes } = useCafeSearch(setSearchResultCafes);

  const [isMapLoading, setIsMapLoading] = useState(true);
  const mapRef = useRef<google.maps.Map | null>(null);
  const [isKeywordSearchOpen, setIsKeywordSearchOpen] = useState(false); // モーダル開閉用

  // ★ カスタマイズモーダルの状態
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

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


  const handleSearchClick = async () => {
    const center = getMapCenter();
    if (!center) return;
    await fetchCafes(center); // 通常検索

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

      {/* ボタン表示 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex space-x-4">
        <MapButton label="更新" onClick={handleSearchClick} />
        <MapButton label="キーワード検索" onClick={() => setIsKeywordSearchOpen(true)} />
        {/* ★ カスタマイズを追加 */}
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
          selectedMapId={selectedMap?.id} // ✅ selectedMapIdを渡す
          onCustomApplied={handleCustomApplied} // ✅ Custom適用後のコールバックを渡す
          initialCustomId={selectedMap?.custom_id} // ✅ 初期選択するCustomIDを渡す
        />
      )}

      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={DEFAULT_CENTER}
        zoom={15}
        onLoad={handleMapLoad}
        onUnmount={() => { mapRef.current = null; }}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || 'DEMO_MAP_ID',
          ...(MAP_STYLES[displayOptions.style] ? { styles: MAP_STYLES[displayOptions.style] } : {}),
        }}
      >
        {/* レイヤー */}
        {displayOptions.layers.traffic && <TrafficLayer />}
        {displayOptions.layers.transit && <TransitLayer />}
        {displayOptions.layers.bicycling && <BicyclingLayer />}

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

        {/* TODO:
            displayOptions.clustering → MarkerClusterer に切替
            displayOptions.heatmap    → HeatmapLayer 追加
         */}
      </GoogleMap>
    </div>
  );
};

export default Map;
