import React, { useEffect, useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { getGoogleMapsApiKey, fetchCafeLocations, getCafePhotoUrl, fetchCafeDetailsFromBackend } from "../services/api";

const containerStyle = {
  width: "100%",
  height: "calc(100vh - 80px)",
};

const defaultCenter = {
  lat: 35.682839, // 東京の緯度
  lng: 139.759455, // 東京の経度
};

interface Cafe {
  lat: number;
  lng: number;
  name: string;
  place_id: string;
  photo_url?: string;
  photo_reference?: string;
}

interface CafeDetails {
  name: string;
  address: string;
  rating?: number;
  opening_hours?: string[];
  photos?: string[];
}

const MapComponent: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<CafeDetails | null>(null);


  // TODO: apiKeyのアクセス制限を設定する
  useEffect(() => {
    getGoogleMapsApiKey().then(setApiKey);
  }, []);

  useEffect(() => {
    if (apiKey) {
      fetchCafeLocations(defaultCenter.lat, defaultCenter.lng).then(async (cafes) => {
        const cafesWithImages = await Promise.all(
          cafes.map(async (cafe: Cafe) => {
            const photoUrl = cafe.photo_reference
              ? await getCafePhotoUrl(cafe.photo_reference)
              : "https://maps.gstatic.com/mapfiles/place_api/icons/cafe-71.png"; // デフォルト画像

            console.log("Photo URL for", cafe.name, ":", photoUrl);


          // 画像を事前に取得して `createRoundedIcon` に渡す
          const img = new Image();
          img.crossOrigin = "anonymous"; // CORS回避
          img.src = photoUrl;

          const roundedPhotoUrl = await createRoundedIcon(img.src);

            return {
              ...cafe,
              photo_url: roundedPhotoUrl,
            };
          })
        );
        setCafes(cafesWithImages);
      });
    }
  }, [apiKey]);

  const fetchCafeDetails = async (placeId: string) => {
    try {
      const cafeDetails = await fetchCafeDetailsFromBackend(placeId);
      setSelectedCafe(cafeDetails);
    } catch (error) {
      console.error("カフェ詳細情報の取得に失敗:", error);
    }
  };

  const handleCafeSelect = (placeId: string) => {
    fetchCafeDetails(placeId);
  };

  const closeDetails = () => setSelectedCafe(null);


  // Canvasを使用して丸形アイコンを作成
  const createRoundedIcon = async (imageUrl: string, size: number = 80): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return resolve("");

      canvas.width = size;
      canvas.height = size;

      const img = new Image();
      img.crossOrigin = "anonymous"; // クロスオリジン対応
      img.src = imageUrl;

      img.onload = () => {
        // 丸形マスクを適用
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 5, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // 画像を描画
        ctx.drawImage(img, 0, 0, size, size);
        ctx.restore(); // クリッピングを解除

        // 枠を追加
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
        ctx.strokeStyle = "#4169e1"; // 水色の枠
        ctx.lineWidth = 15; // 枠の太さ
        ctx.stroke();
        resolve(canvas.toDataURL());
      };

      img.onerror = () => resolve("");
    });
  };

  if (!apiKey) return <div>Loading...</div>;

  return (
    <APIProvider apiKey={apiKey}>
      <div className="relative w-full h-screen flex">
        <div
          className={`absolute top-0 left-0 h-full w-1/3 bg-white shadow-lg transition-transform duration-300 ease-in-out ${
            selectedCafe ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {selectedCafe && (
            <div className="p-4">
              <button onClick={closeDetails} className="absolute top-2 right-2 text-xl">✖</button>
              <h2 className="text-xl font-bold">{selectedCafe.name}</h2>
              <div>
                {selectedCafe.photos && selectedCafe.photos.length > 0 && (
                <img src={selectedCafe.photos[0]} alt={selectedCafe.name} className="w-full mt-2 rounded-lg" />
              )}</div>
              <p>{selectedCafe.address}</p>
              {selectedCafe.rating && <p>評価: ⭐{selectedCafe.rating}</p>}
              {selectedCafe.opening_hours && selectedCafe.opening_hours.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mt-2">営業時間:</h3>
                  <ul className="list-disc list-inside">
                    {selectedCafe.opening_hours?.map((hour, index) => (
                      <li key={index}>{hour}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          )}
        </div>

        <div className="flex-1">
          <Map center={defaultCenter} zoom={16} style={containerStyle}>
            {cafes.map((cafe) => (
              <Marker
                key={cafe.place_id}
                position={{ lat: cafe.lat, lng: cafe.lng }}
                icon={{
                  url: cafe.photo_url!,
                  scaledSize: new window.google.maps.Size(50, 50),
                }}
                onClick={() => handleCafeSelect(cafe.place_id)} // 修正
              />
            ))}
          </Map>
        </div>
      </div>
    </APIProvider>
  );
};

export default MapComponent;
