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

  // 営業時間を曜日ごとにグループ化する関数
  const formatOpenTime = (openTime: string): string => {
    if (!openTime) return "不明";

    const dayOrder = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日", "日曜日"];
    const dayShort = ["月", "火", "水", "木", "金", "土", "日"];

    // 曜日と時間をパース
    const timeMap = new Map<string, string>();
    const timeEntries = openTime.match(/([^\s:：、]+):\s*([^,、]+)/g);

    if (!timeEntries) return openTime;

    timeEntries.forEach((entry) => {
      const [day, time] = entry.split(":");
      if (day && time) {
        timeMap.set(day.trim(), time.trim());
      }
    });

    // 時間帯ごとに曜日をグループ化
    const timeGroups = new Map<string, number[]>();
    dayOrder.forEach((day, index) => {
      const time = timeMap.get(day);
      if (time) {
        if (!timeGroups.has(time)) {
          timeGroups.set(time, []);
        }
        timeGroups.get(time)!.push(index);
      }
    });

    // グループ化した結果を文字列に変換
    const result: string[] = [];
    timeGroups.forEach((dayIndices, time) => {
      const dayRanges: string[] = [];
      let rangeStart = dayIndices[0];
      let rangeEnd = dayIndices[0];

      for (let i = 1; i <= dayIndices.length; i++) {
        if (i < dayIndices.length && dayIndices[i] === rangeEnd + 1) {
          rangeEnd = dayIndices[i];
        } else {
          if (rangeStart === rangeEnd) {
            dayRanges.push(dayShort[rangeStart]);
          } else if (rangeEnd === rangeStart + 1) {
            dayRanges.push(`${dayShort[rangeStart]}・${dayShort[rangeEnd]}`);
          } else {
            dayRanges.push(`${dayShort[rangeStart]}～${dayShort[rangeEnd]}`);
          }
          if (i < dayIndices.length) {
            rangeStart = dayIndices[i];
            rangeEnd = dayIndices[i];
          }
        }
      }

      result.push(`${dayRanges.join("・")}: ${time}`);
    });

    return result.join("\n");
  };

  return (
    <div className="mt-2 text-xs sm:text-sm text-gray-700 overflow-x-auto">
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
            <td className={clsx(tdClass, "whitespace-pre-line")}>{formatOpenTime(openTime)}</td>
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
