import React from "react";

interface CafeDetails {
  name: string;
  address: string;
  rating?: number;
  opening_hours?: string[];
  photos?: string[];
  onClose: () => void;
}

const CafeDetailPanel: React.FC<CafeDetails> = ({ name, address, rating, opening_hours, photos, onClose }) => {
  return (
    <div className="absolute top-0 left-0 h-full w-1/3 bg-white shadow-lg transition-transform duration-300 ease-in-out">
      <div className="p-4">
        <button onClick={onClose} className="absolute top-2 right-2 text-xl">✖</button>
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
