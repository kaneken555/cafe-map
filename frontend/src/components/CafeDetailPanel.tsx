// src/pages/CafeDetailPanel.tsx
import React from "react";
import { addCafe } from "../services/api";
import { CafeDetailProps, CafeData } from "../types/cafe"; // ← ここを修正


const CafeDetailPanel: React.FC<CafeDetailProps> = ({ name, address, placeId, rating, opening_hours, photos, latitude, longitude, onClose, selectedMap }) => {
  // Google Maps の Place ID を使ったリンク
  console.log("placeId", placeId);
  const googleMapsUrl = `https://www.google.com/maps/place/?q=place_id:${placeId}`;


  const handleAddCafe = async () => {
    if (!selectedMap) return;

    const payload = {
      name,
      address,
      place_id: placeId,               // ← ここでsnake_caseに変換
      rating,
      opening_hours,
      photo_urls: photos,
      latitude,
      longitude,
    } as any;

    try {
      await addCafe(selectedMap.id, payload);
      alert("お気に入りに追加しました");
    } catch (error) {
      alert("カフェの追加に失敗しました");
      console.error("addCafe エラー:", error);
    }
  };

  return (
    <div className="absolute top-0 left-0 h-full w-1/3 bg-white shadow-lg transition-transform duration-300 ease-in-out">
      <div className="p-4">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl">✖</button>
        {/* Google Maps ボタン */}
        <div className="mt-4 flex space-x-2">
            <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cafe-action-button flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition"
            >
            <span className="icon text-lg">📍</span>
            <span className="text ml-2">Google Map</span>
            <span className="link-icon ml-1">↗️</span>
            </a>
            {selectedMap && (
              <button
                // onClick={() => alert("お気に入りに追加しました")}
                onClick={handleAddCafe}
                className="cafe-action-button flex items-center bg-yellow-500 text-white px-4 py-2 rounded-lg shadow hover:bg-yellow-600 transition"
              >
                add Cafe
              </button>
            )}
        </div>

        <h2 className="text-xl font-bold">{name}</h2>
        {photos && photos.length > 0 && (
          <img src={photos[0]} alt={name} className="w-full mt-2 rounded-lg" />
        )}
        <p>{address}</p>
        {rating && <p>評価: ⭐{rating}</p>}
        {opening_hours && opening_hours.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mt-2">営業時間:</h3>
            <ul className="list-disc list-inside">
              {opening_hours.map((hour, index) => (
                <li key={index}>{hour}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CafeDetailPanel;
