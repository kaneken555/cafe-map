/**
 * バックエンドCustom APIと統合したカスタマイズ設定モーダル
 */
import React, { useState, useEffect } from "react";
import { Custom, MapStyle, IconVariant, CustomFormData } from "../../types/custom";
import { CustomApiClient } from "../../api/customApiClient";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mapId: number;
  mapName: string;
  onCustomApplied?: () => void;
}

const CustomSettingsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  mapId,
  mapName,
  onCustomApplied,
}) => {
  const [customs, setCustoms] = useState<Custom[]>([]);
  const [selectedCustom, setSelectedCustom] = useState<Custom | null>(null);
  const [activeTab, setActiveTab] = useState<"preset" | "user" | "create">("preset");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Custom新規作成用のフォーム状態
  const [formData, setFormData] = useState<CustomFormData>({
    name: "",
    description: "",
    map_style: "default",
    icon_variant: "photo",
    icon_color: "#3B82F6",
    icon_size: 48,
    show_labels: true,
  });

  // Custom一覧を取得
  const fetchCustoms = async () => {
    try {
      setLoading(true);
      const data = await CustomApiClient.getCustoms();
      setCustoms(data);
      setError(null);
    } catch (err) {
      console.error("Custom取得エラー:", err);
      setError("カスタマイズ設定の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCustoms();
    }
  }, [isOpen]);

  // プリセットCustomとユーザーCustomを分類
  const presetCustoms = customs.filter((c) => c.is_public && !c.is_snapshot);
  const userCustoms = customs.filter((c) => !c.is_public && !c.is_snapshot);

  // Customを選択
  const handleSelectCustom = (custom: Custom) => {
    setSelectedCustom(custom);
  };

  // MapにCustomを適用
  const handleApplyCustom = async () => {
    if (!selectedCustom) {
      setError("カスタマイズ設定を選択してください");
      return;
    }

    try {
      setLoading(true);
      await CustomApiClient.applyCustomToMap(mapId, selectedCustom.id);
      setError(null);
      alert(`「${selectedCustom.name}」を「${mapName}」に適用しました`);
      if (onCustomApplied) {
        onCustomApplied();
      }
      onClose();
    } catch (err) {
      console.error("Custom適用エラー:", err);
      setError("カスタマイズ設定の適用に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // Custom新規作成
  const handleCreateCustom = async () => {
    if (!formData.name.trim()) {
      setError("カスタマイズ設定名を入力してください");
      return;
    }

    try {
      setLoading(true);
      const newCustom = await CustomApiClient.createCustom(formData);
      setError(null);
      alert(`「${newCustom.name}」を作成しました`);
      await fetchCustoms(); // 一覧を再取得
      setActiveTab("user"); // ユーザータブに切り替え
      // フォームをリセット
      setFormData({
        name: "",
        description: "",
        map_style: "default",
        icon_variant: "photo",
        icon_color: "#3B82F6",
        icon_size: 48,
        show_labels: true,
      });
    } catch (err) {
      console.error("Custom作成エラー:", err);
      setError("カスタマイズ設定の作成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  // Custom削除
  const handleDeleteCustom = async (customId: number, customName: string) => {
    if (
      !window.confirm(
        `「${customName}」を削除しますか？\nこのカスタマイズ設定を使用しているマップはデフォルトに変更されます。`
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      await CustomApiClient.deleteCustom(customId);
      setError(null);
      alert(`「${customName}」を削除しました`);
      await fetchCustoms(); // 一覧を再取得
      if (selectedCustom?.id === customId) {
        setSelectedCustom(null);
      }
    } catch (err) {
      console.error("Custom削除エラー:", err);
      setError("カスタマイズ設定の削除に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* panel */}
      <div className="relative z-10 w-[600px] max-w-[95vw] max-h-[80vh] overflow-y-auto rounded-xl bg-white p-5 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">カスタマイズ設定</h2>
          <button
            onClick={onClose}
            className="text-xl leading-none text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <p className="mb-4 text-sm text-gray-600">
          マップ: <strong>{mapName}</strong>
        </p>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        {/* タブ */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("preset")}
            className={`px-4 py-2 rounded ${
              activeTab === "preset"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            プリセット ({presetCustoms.length})
          </button>
          <button
            onClick={() => setActiveTab("user")}
            className={`px-4 py-2 rounded ${
              activeTab === "user"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            マイカスタム ({userCustoms.length})
          </button>
          <button
            onClick={() => setActiveTab("create")}
            className={`px-4 py-2 rounded ${
              activeTab === "create"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            新規作成
          </button>
        </div>

        {loading && <p className="text-center py-4">読み込み中...</p>}

        {/* プリセットタブ */}
        {activeTab === "preset" && !loading && (
          <div>
            <h3 className="text-base font-semibold mb-3">プリセットカスタマイズ</h3>
            <div className="grid grid-cols-2 gap-3">
              {presetCustoms.map((custom) => (
                <div
                  key={custom.id}
                  onClick={() => handleSelectCustom(custom)}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition ${
                    selectedCustom?.id === custom.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: custom.icon_color }}
                  />
                  <p className="font-semibold text-center text-sm">{custom.name}</p>
                  <p className="text-xs text-gray-600 text-center">
                    {custom.map_style} / {custom.icon_variant}
                  </p>
                  <p className="text-xs text-gray-500 text-center">
                    使用中: {custom.used_by_maps_count}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* マイカスタムタブ */}
        {activeTab === "user" && !loading && (
          <div>
            <h3 className="text-base font-semibold mb-3">マイカスタマイズ</h3>
            {userCustoms.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                まだカスタマイズ設定がありません
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {userCustoms.map((custom) => (
                  <div
                    key={custom.id}
                    onClick={() => handleSelectCustom(custom)}
                    className={`relative p-3 border-2 rounded-lg cursor-pointer transition ${
                      selectedCustom?.id === custom.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCustom(custom.id, custom.name);
                      }}
                      className="absolute top-1 right-1 text-gray-400 hover:text-red-600"
                      title="削除"
                    >
                      🗑️
                    </button>
                    <div
                      className="w-10 h-10 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: custom.icon_color }}
                    />
                    <p className="font-semibold text-center text-sm">{custom.name}</p>
                    <p className="text-xs text-gray-600 text-center">
                      {custom.map_style} / {custom.icon_variant}
                    </p>
                    <p className="text-xs text-gray-500 text-center">
                      使用中: {custom.used_by_maps_count}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 新規作成タブ */}
        {activeTab === "create" && !loading && (
          <div>
            <h3 className="text-base font-semibold mb-3">新規カスタマイズ作成</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">設定名 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="例: 私のカスタム"
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">説明</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="説明（任意）"
                  rows={2}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  マップスタイル
                </label>
                <select
                  value={formData.map_style}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      map_style: e.target.value as MapStyle,
                    })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="default">デフォルト</option>
                  <option value="light">ライト</option>
                  <option value="dark">ダーク</option>
                  <option value="mono">モノトーン</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  アイコン表現
                </label>
                <select
                  value={formData.icon_variant}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      icon_variant: e.target.value as IconVariant,
                    })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="photo">写真</option>
                  <option value="pin">ピン</option>
                  <option value="badge">バッジ</option>
                  <option value="bubble">バブル</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  アイコン色
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={formData.icon_color}
                    onChange={(e) =>
                      setFormData({ ...formData, icon_color: e.target.value })
                    }
                    className="w-16 h-10 rounded"
                  />
                  <input
                    type="text"
                    value={formData.icon_color}
                    onChange={(e) =>
                      setFormData({ ...formData, icon_color: e.target.value })
                    }
                    placeholder="#3B82F6"
                    className="flex-1 p-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  アイコンサイズ: {formData.icon_size}px
                </label>
                <input
                  type="range"
                  min="24"
                  max="96"
                  value={formData.icon_size}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      icon_size: Number(e.target.value),
                    })
                  }
                  className="w-full"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="show_labels"
                  checked={formData.show_labels}
                  onChange={(e) =>
                    setFormData({ ...formData, show_labels: e.target.checked })
                  }
                />
                <label htmlFor="show_labels" className="text-sm">
                  店名ラベルを表示
                </label>
              </div>

              <button
                onClick={handleCreateCustom}
                disabled={loading}
                className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                作成
              </button>
            </div>
          </div>
        )}

        {/* 適用ボタン */}
        {(activeTab === "preset" || activeTab === "user") && !loading && (
          <div className="mt-6 flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              キャンセル
            </button>
            <button
              onClick={handleApplyCustom}
              disabled={!selectedCustom || loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
            >
              適用
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomSettingsModal;
