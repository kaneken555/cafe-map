import React, { useState,useEffect } from "react";
// import "../styles/MapCreateModal.css"; // TODO: styleの統一&css修正

interface MapCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void; // ✅ 追加

}

const MapCreateModal: React.FC<MapCreateModalProps> = ({ isOpen, onClose, onCreated }) => {
  const [mapName, setMapName] = useState("");
  const [error, setError] = useState("");
  const [csrfToken, setCsrfToken] = useState(""); // CSRFトークンの状態を管理

  // CSRF トークンを取得
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/csrf/", {
          credentials: "include",  // クッキーを含める
        });
        const data = await response.json();
        setCsrfToken(data.csrfToken);
        console.log("CSRF トークンを取得しました:", data.csrfToken);
      } catch (error) {
        console.error("CSRF トークンの取得に失敗しました:", error);
      }
    };

    fetchCsrfToken();
  },[isOpen]);

  const handleCreateMap = async () => {
    if (!mapName) {
      setError("マップ名を入力してください");
      return;
    }

    try {
      // TODO:axiosを使ってバックエンドにマップ名を送信する 
      const response = await fetch("http://localhost:8000/api/maps/", {
        method: "POST",
        credentials: "include",  // セッションID（クッキー）を送信
        headers: { 
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,  // CSRF トークンを送信
        },
        body: JSON.stringify({ name: mapName }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "マップの作成に失敗しました");
      }

      // ✅ 作成成功時に親コンポーネントへ通知
      if (onCreated) {
        onCreated();
      } else {
        onClose(); // 念のため fallback
      }
      setMapName(""); // 入力をリセット
    } catch (error) {
        if (error instanceof Error) {
            setError(error.message);
          } else {
            setError("予期しないエラーが発生しました"); 
          }
        }
    };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>マップ作成</h2>
        <input
          type="text"
          value={mapName}
          onChange={(e) => setMapName(e.target.value)}
          placeholder="マップ名を入力"
        />
        {error && <p className="error-text">{error}</p>}
        <button onClick={handleCreateMap}>作成</button>
        <button onClick={onClose}>キャンセル</button>
      </div>
    </div>
  );
};

export default MapCreateModal;
