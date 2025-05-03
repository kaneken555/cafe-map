// src/components/LoadingOverlay.tsx
import React, { useEffect, useState } from "react";

interface LoadingOverlayProps {
  loadingImageSrc?: string;
  minDuration?: number; // ✅ 最低表示時間（ミリ秒）
  isActive: boolean;    // ✅ 表示/非表示制御
  onFinish?: () => void; // ✅ 表示終了コールバック（任意）
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loadingImageSrc,
  minDuration = 0,         // デフォルトは0ms（即解除OK）
  isActive,
  onFinish,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: number; 

    if (isActive) {
      setVisible(true);
      timer = setTimeout(() => {
        if (onFinish) onFinish(); // 呼び出し元に通知
      }, minDuration);
    } else {
      setVisible(false); // 即非表示（またはfadeOutでもOK）
    }

    return () => clearTimeout(timer);
  }, [isActive, minDuration, onFinish]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
      {loadingImageSrc ? (
        <img src={loadingImageSrc} alt="Loading..." className="w-144 h-auto object-contain" />
      ) : (
        <div className="loader" />
      )}
    </div>
  );
};

export default LoadingOverlay;
