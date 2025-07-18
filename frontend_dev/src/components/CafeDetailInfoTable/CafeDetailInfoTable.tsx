// components/CafeDetailInfoTable.tsx
import React from "react";
import clsx from "clsx";

interface CafeDetailInfoTableProps {
  address: string;
  rating: number;
  openTime: string;
  phoneNumber?: string;
  website?: string;
}

const CafeDetailInfoTable: React.FC<CafeDetailInfoTableProps> = ({ address, rating, openTime, phoneNumber, website }) => {

  const thClass = clsx("text-left font-semibold pr-2 py-1 align-top");
  const tdClass = clsx("py-1");

  return (
    <div className="mt-2 text-sm text-gray-700 overflow-x-auto">
      <table className="w-full border-collapse">
        <tbody>
          <tr className="border-b">
            <th className={thClass}>住所:</th>
            <td className={tdClass}>{address}</td>
          </tr>
          <tr className="border-b">
            <th className={thClass}>評価:</th>
            <td className={tdClass}>⭐️ {rating.toFixed(1)} / 5</td>
          </tr>
          <tr className="border-b">
            <th className={thClass}>営業時間:</th>
            <td className={tdClass}>{openTime}</td>
          </tr>
          <tr className="border-b">
            <th className={thClass}>電話番号:</th>
            <td className={tdClass}>{phoneNumber}</td>
          </tr>
          <tr>
            <th className={thClass}>HP:</th>
            <td className={tdClass}>
              {website ? (
                <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className={clsx("text-blue-600 hover:underline break-words")}
                >
                  {website}
                </a>
              ) : (
                "なし"
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CafeDetailInfoTable;
