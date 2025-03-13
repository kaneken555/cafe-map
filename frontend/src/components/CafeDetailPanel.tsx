import React from "react";

interface CafeDetails {
  name: string;
  address: string;
  placeId: string; // Place ID を追加
  rating?: number;
  opening_hours?: string[];
  photos?: string[];
  onClose: () => void;
}

const CafeDetailPanel: React.FC<CafeDetails> = ({ name, address,placeId, rating, opening_hours, photos, onClose }) => {
  // Google Maps の Place ID を使ったリンク
  console.log("placeId", placeId);
  const googleMapsUrl = `https://www.google.com/maps/place/?q=place_id:${placeId}`;

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
