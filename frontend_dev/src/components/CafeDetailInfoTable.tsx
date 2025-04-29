// components/CafeDetailInfoTable.tsx
interface CafeDetailInfoTableProps {
  address: string;
  rating: number;
  openTime: string;
  phoneNumber?: string;
  website?: string;
}

const CafeDetailInfoTable: React.FC<CafeDetailInfoTableProps> = ({ address, rating, openTime, phoneNumber, website }) => {
  return (
    <div className="mt-2 text-sm text-gray-700 overflow-x-auto">
      <table className="w-full border-collapse">
        <tbody>
          <tr className="border-b">
            <th className="text-left font-semibold pr-2 py-1 align-top">住所:</th>
            <td className="py-1">{address}</td>
          </tr>
          <tr className="border-b">
            <th className="text-left font-semibold pr-2 py-1 align-top">評価:</th>
            <td className="py-1">⭐️ {rating.toFixed(1)} / 5</td>
          </tr>
          <tr className="border-b">
            <th className="text-left font-semibold pr-2 py-1 align-top">営業時間:</th>
            <td className="py-1">{openTime}</td>
          </tr>
          <tr className="border-b">
            <th className="text-left font-semibold pr-2 py-1 align-top">電話番号:</th>
            <td className="py-1">{phoneNumber}</td>
          </tr>
          <tr>
            <th className="text-left font-semibold pr-2 py-1 align-top">HP:</th>
            <td className="py-1">
              {website ? (
                <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-words">
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
