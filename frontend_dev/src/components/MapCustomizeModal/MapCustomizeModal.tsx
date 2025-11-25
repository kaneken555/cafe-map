import React, { useMemo, useState, useEffect } from "react";
import { MapDisplayOptions, MapStyleKey, IconVariant } from "../../types/mapDisplay";
import { MapPreview } from "./MapPreview";
import { CustomApiClient } from "../../api/customApiClient";
import type { Custom } from "../../types/custom";
import { toast } from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react"; // ✅ アイコンをインポート
import CloseModalButton from "../CloseModalButton/CloseModalButton"; // ✅ 閉じるボタンをインポート
import { useIsMobile } from "../../hooks/useMediaQuery";

interface Props {
  value: MapDisplayOptions;
  onChange: (next: MapDisplayOptions) => void;
  onClose: () => void;
  previewPoints?: { lat: number; lng: number }[]; // 任意:プレビュー用ダミー座標
  selectedMapId?: number; // ✅ 選択中のマップID（Custom適用用）
  onCustomApplied?: (customId: number) => void; // ✅ Custom適用後のコールバック
  initialCustomId?: number; // ✅ 初期選択するCustomID
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

const MapCustomizeModal: React.FC<Props> = ({ value, onChange, onClose, previewPoints, selectedMapId, onCustomApplied, initialCustomId }) => {
  const [local, setLocal] = useState<MapDisplayOptions>(value);
  const dirty = useMemo(() => JSON.stringify(local) !== JSON.stringify(value), [local, value]);
  const isMobile = useIsMobile();

  // ✅ Custom選択機能
  const [customs, setCustoms] = useState<Custom[]>([]);
  const [selectedCustomId, setSelectedCustomId] = useState<number | null>(initialCustomId ?? null);
  const [loading, setLoading] = useState(false);
  const [showPresets, setShowPresets] = useState(false); // プリセットセクションの表示状態

  // ✅ プレビューの高さをレスポンシブ対応
  const [previewHeight, setPreviewHeight] = useState<number>(300);

  useEffect(() => {
    const updatePreviewHeight = () => {
      // 768px (md) 未満の場合は150px、以上の場合は300px
      setPreviewHeight(window.innerWidth < 768 ? 150 : 300);
    };

    updatePreviewHeight();
    window.addEventListener('resize', updatePreviewHeight);
    return () => window.removeEventListener('resize', updatePreviewHeight);
  }, []);

  // ✅ Custom一覧を取得
  useEffect(() => {
    const fetchCustoms = async () => {
      try {
        setLoading(true);
        const data = await CustomApiClient.getCustoms();
        setCustoms(data);
      } catch (error) {
        console.error("Custom取得エラー:", error);
        toast.error("カスタマイズ設定の取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };
    fetchCustoms();
  }, []);

  // ✅ Custom選択時に設定を反映
  const handleCustomSelect = async (customId: string) => {
    if (customId === "none") {
      setSelectedCustomId(null);
      return;
    }

    const id = Number(customId);
    setSelectedCustomId(id);

    try {
      const custom = await CustomApiClient.getCustomById(id);
      // Custom設定をlocalに反映
      setLocal({
        ...local,
        style: custom.map_style,
        iconVariant: custom.icon_variant,
        iconColor: custom.icon_color,
        iconSize: custom.icon_size,
        showLabels: custom.show_labels,
      });
      toast.success(`「${custom.name}」を読み込みました`);
    } catch (error) {
      console.error("Custom読み込みエラー:", error);
      toast.error("カスタマイズ設定の読み込みに失敗しました");
    }
  };

  // ✅ Custom新規作成
  const handleCreateCustom = async () => {
    const name = window.prompt("カスタマイズ設定の名前を入力してください");
    if (!name) return;

    try {
      setLoading(true);
      const newCustom = await CustomApiClient.createCustom({
        name,
        description: "",
        map_style: local.style,
        icon_variant: local.iconVariant,
        icon_color: local.iconColor,
        icon_size: local.iconSize,
        show_labels: local.showLabels,
      });

      // 一覧を再取得
      const updatedCustoms = await CustomApiClient.getCustoms();
      setCustoms(updatedCustoms);
      setSelectedCustomId(newCustom.id);

      toast.success(`「${newCustom.name}」を作成しました`);
    } catch (error) {
      console.error("Custom作成エラー:", error);
      toast.error("カスタマイズ設定の作成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Custom削除
  const handleDeleteCustom = async () => {
    if (!selectedCustomId) return;

    const custom = customs.find(c => c.id === selectedCustomId);
    if (!custom) return;

    if (!window.confirm(`「${custom.name}」を削除しますか？`)) return;

    try {
      setLoading(true);
      await CustomApiClient.deleteCustom(selectedCustomId);

      // 一覧を再取得
      const updatedCustoms = await CustomApiClient.getCustoms();
      setCustoms(updatedCustoms);
      setSelectedCustomId(null);

      toast.success(`「${custom.name}」を削除しました`);
    } catch (error) {
      console.error("Custom削除エラー:", error);
      toast.error("カスタマイズ設定の削除に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => setLocal(value);
  const applyOnly = () => onChange(local); // 適用のみ（閉じない）
  const applyAndClose = async () => {
    onChange(local);

    // ✅ selectedMapIdがある場合、バックエンドに適用
    if (selectedMapId) {
      try {
        if (selectedCustomId) {
          // プリセットが選択されている場合、そのCustomを適用
          await CustomApiClient.applyCustomToMap(selectedMapId, selectedCustomId);
          onCustomApplied?.(selectedCustomId);
          toast.success("カスタマイズ設定をマップに適用しました");
        } else {
          // 手動で設定を変更した場合、新しいCustomを作成して適用
          const customName = `カスタム設定（自動保存）`;
          const newCustom = await CustomApiClient.createCustom({
            name: customName,
            description: "",
            map_style: local.style,
            icon_variant: local.iconVariant,
            icon_color: local.iconColor,
            icon_size: local.iconSize,
            show_labels: local.showLabels,
          });

          await CustomApiClient.applyCustomToMap(selectedMapId, newCustom.id);
          onCustomApplied?.(newCustom.id);
          toast.success("カスタマイズ設定を保存してマップに適用しました");
        }
      } catch (error) {
        console.error("Custom適用エラー:", error);
        toast.error("カスタマイズ設定の適用に失敗しました");
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* panel */}
      <div className={`relative z-10 w-[900px] max-w-[95vw] rounded-xl bg-white p-3 shadow-lg overflow-y-auto ${
        isMobile ? "max-h-[calc(90vh-3.5rem)]" : "max-h-[90vh]"
      }`}>
        <CloseModalButton onClose={onClose} />
        <h2 className="mb-2 text-lg font-semibold">表示カスタマイズ</h2>

        {/* ✅ Custom選択セクション - 折りたたみ対応 */}
        <div className="mb-4">
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="w-full flex items-center justify-between px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded border border-gray-200 transition-colors"
          >
            <span className="text-xs font-medium">
              カスタマイズプリセット {selectedCustomId && `(${customs.find(c => c.id === selectedCustomId)?.name || '選択中'})`}
            </span>
            <span className="text-xs text-gray-600">
              {showPresets ? '▲' : '▼'}
            </span>
          </button>

          {showPresets && (
            <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex gap-2">
            <select
              className="flex-1 rounded border p-2 text-sm md:text-base"
              value={selectedCustomId?.toString() || "none"}
              onChange={(e) => handleCustomSelect(e.target.value)}
              disabled={loading}
            >
              <option value="none">カスタム（現在の設定）</option>
              <optgroup label="プリセット">
                {customs.filter(c => c.is_public).map((custom) => (
                  <option key={custom.id} value={custom.id}>
                    {custom.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="マイカスタム">
                {customs.filter(c => !c.is_public).map((custom) => (
                  <option key={custom.id} value={custom.id}>
                    {custom.name}
                  </option>
                ))}
              </optgroup>
            </select>
            {/* 新規作成アイコンボタン */}
            <button
              className="p-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 transition-colors cursor-pointer"
              onClick={handleCreateCustom}
              disabled={loading}
              aria-label="新規作成"
              title="新規作成"
            >
              <Plus className="w-5 h-5" />
            </button>
            {/* 削除アイコンボタン */}
            <button
              className="p-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-gray-400 transition-colors cursor-pointer"
              onClick={handleDeleteCustom}
              disabled={!selectedCustomId || loading || customs.find(c => c.id === selectedCustomId)?.is_public}
              aria-label="削除"
              title="削除"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            プリセットから選択するか、下の設定を変更して新規作成できます
          </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* 左：フォーム */}
          <div className="space-y-2">
            {/* スタイル */}
            <div>
              <label className="block text-sm font-medium mb-1">マップスタイル</label>
              <select
                className="w-full rounded border p-2 text-sm md:text-base"
                value={local.style}
                onChange={(e) => setLocal({ ...local, style: e.target.value as MapStyleKey })}
              >
                {styles.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* アイコン */}
            <div>
              <label className="block text-sm font-medium mb-1">アイコン表現</label>
              <select
                className="w-full rounded border p-2 text-sm md:text-base"
                value={local.iconVariant}
                onChange={(e) => setLocal({ ...local, iconVariant: e.target.value as IconVariant })}
              >
                {iconVariants.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
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
              <label htmlFor="showLabels" className="text-sm md:text-base">店名ラベルを表示（ズーム条件はMap側で制御）</label>
            </div>

            {/* レイヤー */}
            <fieldset className="border rounded p-2">
              <legend className="text-sm font-medium px-1">レイヤー</legend>
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-2 text-sm md:text-base">
                  <input
                    type="checkbox"
                    checked={local.layers.traffic}
                    onChange={(e) =>
                      setLocal({ ...local, layers: { ...local.layers, traffic: e.target.checked } })
                    }
                  />
                  交通状況
                </label>
                <label className="flex items-center gap-2 text-sm md:text-base">
                  <input
                    type="checkbox"
                    checked={local.layers.transit}
                    onChange={(e) =>
                      setLocal({ ...local, layers: { ...local.layers, transit: e.target.checked } })
                    }
                  />
                  公共交通
                </label>
                <label className="flex items-center gap-2 text-sm md:text-base">
                  <input
                    type="checkbox"
                    checked={local.layers.bicycling}
                    onChange={(e) =>
                      setLocal({ ...local, layers: { ...local.layers, bicycling: e.target.checked } })
                    }
                  />
                  自転車道
                </label>
              </div>
            </fieldset>
          </div>

          {/* 右：ライブプレビュー */}
          <div>
            <div className="mb-1 text-sm font-medium text-gray-700 flex items-center justify-between">
              <span>プレビュー</span>
              <span className="text-xs text-gray-500">{dirty ? "未保存の変更があります" : "保存済み"}</span>
            </div>
            <MapPreview options={local} points={previewPoints} height={previewHeight} />
            <p className="text-xs text-gray-500 mt-1">※ Google Maps API が未ロードの場合は簡易プレビューで表示されます。</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap justify-end gap-2">
          <button className="rounded border px-4 py-2 text-sm md:text-base" onClick={reset} disabled={!dirty}>
            リセット
          </button>
          <button className="rounded border px-4 py-2 text-sm md:text-base" onClick={applyOnly} disabled={!dirty}>
            適用
          </button>
          <button className="rounded bg-blue-600 px-4 py-2 text-white text-sm md:text-base" onClick={applyAndClose} disabled={!dirty}>
            保存して閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapCustomizeModal;
