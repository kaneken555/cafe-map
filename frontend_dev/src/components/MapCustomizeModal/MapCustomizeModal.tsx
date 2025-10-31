// components/MapCustomizeModal/MapCustomizeModal.tsx
import React, { useState } from "react";
import { MapDisplayOptions, MapStyleKey, IconVariant } from "../../types/mapDisplay";

interface Props {
  value: MapDisplayOptions;
  onChange: (next: MapDisplayOptions) => void;
  onClose: () => void;
}

const styles: { label: string; value: MapStyleKey }[] = [
  { label: "デフォルト", value: "default" },
  { label: "ライト", value: "light" },
  { label: "ダーク", value: "dark" },
  { label: "モノトーン", value: "mono" },
];

const iconVariants: { label: string; value: IconVariant }[] = [
  { label: "ピン", value: "pin" },
  { label: "バッジ", value: "badge" },
  { label: "バブル", value: "bubble" },
  { label: "写真サムネ", value: "photo" },
];

const MapCustomizeModal: React.FC<Props> = ({ value, onChange, onClose }) => {
  const [local, setLocal] = useState<MapDisplayOptions>(value);

  const apply = () => {
    onChange(local);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* panel */}
      <div className="relative z-10 w-[560px] max-w-[92vw] rounded-xl bg-white p-5 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">表示カスタマイズ</h2>

        <div className="space-y-4">
          {/* スタイル */}
          <div>
            <label className="block text-sm font-medium mb-1">マップスタイル</label>
            <select
              className="w-full rounded border p-2"
              value={local.style}
              onChange={(e) => setLocal({ ...local, style: e.target.value as MapStyleKey })}
            >
              {styles.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {/* アイコン */}
          <div>
            <label className="block text-sm font-medium mb-1">アイコン表現</label>
            <select
              className="w-full rounded border p-2"
              value={local.iconVariant}
              onChange={(e) => setLocal({ ...local, iconVariant: e.target.value as IconVariant })}
            >
              {iconVariants.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
            </select>
          </div>

          {/* アイコンカラー */}
          <div>
            <label className="block text-sm font-medium mb-1">アイコンカラー</label>
            <input
              type="color"
              value={local.iconColor || "#3B82F6"}
              onChange={(e) => setLocal({ ...local, iconColor: e.target.value })}
            />
          </div>

          {/* アイコンサイズ */}
          <div>
            <label className="block text-sm font-medium mb-1">アイコンサイズ</label>
            <input
              type="range"
              min={24}
              max={96}
              step={4}
              value={local.iconSize}
              onChange={(e) => setLocal({ ...local, iconSize: Number(e.target.value) })}
              className="w-full accent-blue-500"
            />
            <p className="text-xs text-gray-600 mt-1">{local.iconSize}px</p>
          </div>

          {/* ラベル */}
          <div className="flex items-center gap-2">
            <input
              id="showLabels"
              type="checkbox"
              checked={local.showLabels}
              onChange={(e) => setLocal({ ...local, showLabels: e.target.checked })}
            />
            <label htmlFor="showLabels">店名ラベルを表示（ズーム条件はMap側で制御）</label>
          </div>

          {/* レイヤー */}
          <fieldset className="border rounded p-3">
            <legend className="text-sm font-medium">レイヤー</legend>
            <div className="mt-1 space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={local.layers.traffic}
                  onChange={(e) => setLocal({ ...local, layers: { ...local.layers, traffic: e.target.checked } })}
                />
                交通状況
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={local.layers.transit}
                  onChange={(e) => setLocal({ ...local, layers: { ...local.layers, transit: e.target.checked } })}
                />
                公共交通
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={local.layers.bicycling}
                  onChange={(e) => setLocal({ ...local, layers: { ...local.layers, bicycling: e.target.checked } })}
                />
                自転車道
              </label>
            </div>
          </fieldset>

          {/* 集約表示 */}
          <div className="flex items-center gap-2">
            <input
              id="clustering"
              type="checkbox"
              checked={local.clustering}
              onChange={(e) => setLocal({ ...local, clustering: e.target.checked })}
            />
            <label htmlFor="clustering">クラスタ表示を有効化</label>
          </div>

          {/* ヒートマップ */}
          <div className="flex items-center gap-2">
            <input
              id="heatmap"
              type="checkbox"
              checked={local.heatmap}
              onChange={(e) => setLocal({ ...local, heatmap: e.target.checked })}
            />
            <label htmlFor="heatmap">ヒートマップを有効化</label>
          </div>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button className="rounded border px-4 py-2" onClick={onClose}>キャンセル</button>
          <button className="rounded bg-blue-600 px-4 py-2 text-white" onClick={apply}>保存</button>
        </div>
      </div>
    </div>
  );
};

export default MapCustomizeModal;
