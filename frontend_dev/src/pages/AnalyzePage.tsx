// pages/AnalyzePage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { MapApiClient } from "../api/mapApiClient";
import { AnalyzeApiClient } from "../api/analyzeApiClient";
import {
  MapAnalyzeData,
  ShareChannel,
  AnalyzeLink,
} from "../types/analyze";
import { MapItem } from "../types/map";
import Header from "../components/Header/Header";

const AnalyzePage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [maps, setMaps] = useState<MapItem[]>([]);
  const [selectedMapId, setSelectedMapId] = useState<number | null>(null);
  const [analyzeData, setAnalyzeData] = useState<MapAnalyzeData | null>(null);
  const [shareChannels, setShareChannels] = useState<ShareChannel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedChannelKey, setSelectedChannelKey] = useState<string>("");
  const [customLabel, setCustomLabel] = useState<string>("");
  const [editingLinkId, setEditingLinkId] = useState<number | null>(null);
  const [editingLabel, setEditingLabel] = useState<string>("");

  // マップ一覧を読み込み
  useEffect(() => {
    if (user) {
      loadMaps();
    }
  }, [user]);

  // 選択されたマップのアナライズデータを読み込み
  useEffect(() => {
    if (selectedMapId) {
      loadData();
    }
  }, [selectedMapId]);

  const loadMaps = async () => {
    try {
      const mapList = await MapApiClient.getMapList();
      setMaps(mapList);
      // 最初のマップを自動選択
      if (mapList.length > 0 && !selectedMapId) {
        setSelectedMapId(mapList[0].id);
      }
    } catch (err) {
      console.error("マップ一覧の取得に失敗:", err);
    }
  };

  const loadData = async () => {
    if (!selectedMapId) {
      setAnalyzeData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [channels, data] = await Promise.all([
        AnalyzeApiClient.getShareChannels(),
        AnalyzeApiClient.getMapAnalyzeData(selectedMapId),
      ]);
      setShareChannels(channels);
      setAnalyzeData(data);
    } catch (err: any) {
      setError(err.response?.data?.error || "データの取得に失敗しました");
      console.error("アナライズデータ取得エラー:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLink = async () => {
    if (!selectedMapId || !selectedChannelKey) {
      alert("共有先を選択してください");
      return;
    }

    try {
      await AnalyzeApiClient.createOrGetAnalyzeLink(selectedMapId, {
        channel_key: selectedChannelKey,
        custom_label: customLabel || undefined,
      });
      setSelectedChannelKey("");
      setCustomLabel("");
      await loadData();
      alert("シェアリンクを作成しました");
    } catch (err: any) {
      alert(err.response?.data?.error || "シェアリンクの作成に失敗しました");
      console.error("シェアリンク作成エラー:", err);
    }
  };

  const handleUpdateLabel = async (linkId: number) => {
    try {
      await AnalyzeApiClient.updateAnalyzeLinkLabel(linkId, {
        custom_label: editingLabel,
      });
      setEditingLinkId(null);
      setEditingLabel("");
      await loadData();
    } catch (err: any) {
      alert(err.response?.data?.error || "ラベルの更新に失敗しました");
      console.error("ラベル更新エラー:", err);
    }
  };

  const copyToClipboard = (url: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    alert("シェアリンクをコピーしました");
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("ja-JP");
  };

  // Header用のダミー関数（アナライズページでは不要な機能）
  const dummyFunction = () => {};

  // ログインチェック
  if (!user) {
    return (
      <div>
        <Header
          closeCafeListPanel={dummyFunction}
          isMyCafeListOpen={false}
          setShareUuid={() => {}}
          onOpenCafeList={dummyFunction}
          onOpenMapList={dummyFunction}
        />
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <h2 style={{ marginBottom: "20px" }}>アクセス権限がありません</h2>
          <p style={{ marginBottom: "30px", color: "#666" }}>
            アナライズ機能を利用するには、ログインが必要です。
          </p>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "10px 30px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            ホームに戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header
        closeCafeListPanel={dummyFunction}
        isMyCafeListOpen={false}
        setShareUuid={() => {}}
        onOpenCafeList={dummyFunction}
        onOpenMapList={dummyFunction}
      />
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "8px 16px",
              backgroundColor: "#f5f5f5",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
              marginRight: "20px",
              display: "flex",
              alignItems: "center",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e0e0e0")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
          >
            ← ホームに戻る
          </button>
          <h1 style={{ margin: 0 }}>アナライズ</h1>
        </div>

        {/* マップ選択UI */}
        <div
          style={{
            marginBottom: "30px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
          }}
        >
          <label style={{ fontSize: "16px", fontWeight: "bold" }}>
            マップを選択:{" "}
            <select
              value={selectedMapId || ""}
              onChange={(e) => setSelectedMapId(Number(e.target.value))}
              style={{
                padding: "8px",
                marginLeft: "10px",
                fontSize: "14px",
                borderRadius: "4px",
                border: "1px solid #ccc",
                minWidth: "250px",
              }}
            >
              {maps.length === 0 ? (
                <option value="">マップがありません</option>
              ) : (
                maps.map((map) => (
                  <option key={map.id} value={map.id}>
                    {map.name}
                  </option>
                ))
              )}
            </select>
          </label>
        </div>

        {isLoading && (
          <div style={{ padding: "20px", textAlign: "center" }}>
            読み込み中...
          </div>
        )}

        {!selectedMapId && !isLoading && maps.length > 0 && (
          <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
            マップを選択してください
          </div>
        )}

        {maps.length === 0 && !isLoading && (
          <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
            マップがありません。まずマップを作成してください。
          </div>
        )}

        {selectedMapId && !isLoading && (
          <>

        {error && (
          <div style={{ color: "red", marginBottom: "20px" }}>{error}</div>
        )}

        {/* 直接アクセス */}
        <div
          style={{
            marginBottom: "30px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h2>直接アクセス</h2>
          <p>
            アクセス数: <strong>{analyzeData?.direct_access_count || 0}</strong>
          </p>
          <p>最終アクセス: {formatDate(analyzeData?.direct_last_accessed_at)}</p>
        </div>

        {/* シェアリンク作成 */}
        <div
          style={{
            marginBottom: "30px",
            padding: "15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h2>新規シェアリンク作成</h2>
          <div style={{ marginBottom: "10px" }}>
            <label>
              共有先:{" "}
              <select
                value={selectedChannelKey}
                onChange={(e) => setSelectedChannelKey(e.target.value)}
                style={{ padding: "5px", marginLeft: "10px" }}
              >
                <option value="">選択してください</option>
                {shareChannels.map((ch) => (
                  <option key={ch.key} value={ch.key}>
                    {ch.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label>
              メモ（任意）:{" "}
              <input
                type="text"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder="例: 技術ブログ用"
                style={{ padding: "5px", marginLeft: "10px", width: "300px" }}
              />
            </label>
          </div>
          <button
            onClick={handleCreateLink}
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            シェアリンク作成
          </button>
        </div>

        {/* シェアリンク一覧 */}
        <div>
          <h2>シェアリンク一覧</h2>
          {!analyzeData?.analyze_links ||
          analyzeData.analyze_links.length === 0 ? (
            <p>シェアリンクがありません</p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f5f5f5" }}>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    共有先
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    メモ
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    アクセス数
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    最終アクセス
                  </th>
                  <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                {analyzeData.analyze_links.map((link: AnalyzeLink) => (
                  <tr key={link.id}>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {link.channel_name}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {editingLinkId === link.id ? (
                        <div>
                          <input
                            type="text"
                            value={editingLabel}
                            onChange={(e) => setEditingLabel(e.target.value)}
                            style={{ width: "100%", padding: "5px" }}
                          />
                          <button
                            onClick={() => handleUpdateLabel(link.id)}
                            style={{
                              padding: "5px 10px",
                              marginTop: "5px",
                              marginRight: "5px",
                            }}
                          >
                            保存
                          </button>
                          <button
                            onClick={() => {
                              setEditingLinkId(null);
                              setEditingLabel("");
                            }}
                            style={{ padding: "5px 10px", marginTop: "5px" }}
                          >
                            キャンセル
                          </button>
                        </div>
                      ) : (
                        <div>
                          {link.custom_label || "-"}
                          <button
                            onClick={() => {
                              setEditingLinkId(link.id);
                              setEditingLabel(link.custom_label || "");
                            }}
                            style={{
                              marginLeft: "10px",
                              padding: "3px 8px",
                              fontSize: "12px",
                            }}
                          >
                            編集
                          </button>
                        </div>
                      )}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {link.access_count}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      {formatDate(link.last_accessed_at)}
                    </td>
                    <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                      <button
                        onClick={() => copyToClipboard(link.share_link_url)}
                        style={{
                          padding: "5px 10px",
                          marginRight: "5px",
                          backgroundColor: "#28a745",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        コピー
                      </button>
                      <button
                        onClick={() =>
                          window.open(link.share_link_url, "_blank")
                        }
                        style={{
                          padding: "5px 10px",
                          backgroundColor: "#6c757d",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                      >
                        開く
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default AnalyzePage;
