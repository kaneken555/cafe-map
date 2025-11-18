// pages/SharedMapViewPage.tsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { LoadScript, GoogleMap } from "@react-google-maps/api";
import { getPublicSharedMapDetail } from "../api/sharedMap";
import CafeOverlayIcon from "../components/CafeOverlayIcon/CafeOverlayIcon";
import CafeDetailPanel from "../components/CafeDetailPanel/CafeDetailPanel";
import LoadingOverlay from "../components/LoadingOverlay/LoadingOverlay";
import Header from "../components/Header/Header";
import { Cafe } from "../types/cafe";
import { DEFAULT_CENTER, MAP_CONTAINER_STYLE } from "../constants/map";

const SharedMapViewPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const mapRef = useRef<google.maps.Map | null>(null);

  const [mapData, setMapData] = useState<{ name: string; cafes: Cafe[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCafe, setSelectedCafe] = useState<Cafe | null>(null);
  const [isMyCafeListOpen, setIsMyCafeListOpen] = useState(false);

  useEffect(() => {
    const fetchSharedMap = async () => {
      if (!uuid) {
        setError("無効なURLです");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // URLのクエリパラメータを取得
        const src = searchParams.get("src");
        const data = await getPublicSharedMapDetail(uuid, src);

        // APIレスポンスをCafe型にマッピング
        const mappedCafes: Cafe[] = data.cafes.map((cafe) => ({
          id: cafe.id,
          placeId: cafe.place_id,
          name: cafe.name,
          address: cafe.address,
          openTime: cafe.opening_hours || "",
          status: "OPEN", // デフォルト値
          distance: "", // 共有マップでは距離情報なし
          photoUrls: cafe.photo_urls || [],
          rating: cafe.rating || 0,
          priceLevel: cafe.price_level,
          phoneNumber: cafe.phone_number,
          website: cafe.website,
          lat: cafe.latitude,
          lng: cafe.longitude,
        }));

        setMapData({
          name: data.name,
          cafes: mappedCafes,
        });
      } catch (err: any) {
        console.error("シェアマップの取得に失敗:", err);
        if (err.response?.status === 404) {
          setError("このシェアマップは存在しません");
        } else {
          setError("シェアマップの読み込みに失敗しました");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedMap();
  }, [uuid]);

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full">
        <LoadingOverlay
          loadingImageSrc="/loading.png"
          minDuration={1000}
          isActive={true}
          onFinish={() => {}}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">エラー</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col">
      {/* ヘッダー */}
      <Header
        closeCafeListPanel={() => setIsMyCafeListOpen(false)}
        isMyCafeListOpen={isMyCafeListOpen}
        setShareUuid={() => {}} // 共有マップビューでは使用しない
        onOpenCafeList={() => {}} // 共有マップビューでは使用しない
        onShowMyCafeMap={() => {}} // 共有マップビューでは使用しない
        onOpenMapList={() => navigate("/")} // ホームへ遷移
        isSharedMapView={true} // シェアマップビュー
        sharedMapName={mapData?.name} // シェアマップの名前
      />

      {/* マップ */}
      <div className="flex-grow">
        <LoadScript googleMapsApiKey={apiKey}>
          <GoogleMap
            mapContainerStyle={MAP_CONTAINER_STYLE}
            center={
              mapData?.cafes[0]
                ? { lat: mapData.cafes[0].lat, lng: mapData.cafes[0].lng }
                : DEFAULT_CENTER
            }
            zoom={13}
            onLoad={handleMapLoad}
            onUnmount={() => { mapRef.current = null; }}
            options={{
              mapTypeControl: false,
              streetViewControl: false,
            }}
          >
            {mapData?.cafes.map((cafe) => (
              <CafeOverlayIcon
                key={cafe.id}
                cafe={cafe}
                isSelected={selectedCafe?.id === cafe.id}
                showLabel={false}
                variant="photo"
                color="#3B82F6"
                size={48}
                onClick={() => setSelectedCafe(cafe)}
              />
            ))}
          </GoogleMap>
        </LoadScript>
      </div>

      {/* カフェ詳細パネル */}
      <CafeDetailPanel
        cafe={selectedCafe}
        onClose={() => setSelectedCafe(null)}
        onAddCafeToMapClick={() => {
          // 共有マップでは追加機能は無効
          alert("共有マップではカフェの追加はできません");
        }}
      />
    </div>
  );
};

export default SharedMapViewPage;
