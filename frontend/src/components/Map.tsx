import React, { useEffect, useState } from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { getGoogleMapsApiKey, fetchCafeLocations, getCafePhotoUrl } from "../services/api";

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

const MapComponent: React.FC = () => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [cafes, setCafes] = useState<Cafe[]>([]);

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
      <Map center={defaultCenter} zoom={16} style={containerStyle}>
        {cafes.map((cafe) => (
          <Marker
            key={cafe.place_id}
            position={{ lat: cafe.lat, lng: cafe.lng }}
            icon={{
              url: cafe.photo_url!,
              scaledSize: new window.google.maps.Size(50, 50),
            }}
          />
        ))}
      </Map>
    </APIProvider>
  );
};

export default MapComponent;
