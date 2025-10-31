// components/ShareMapModal.tsx
import React, { useMemo, useRef, useState } from "react";
import { Share2 } from "lucide-react";
import BaseModal from "../BaseModal/BaseModal";
import toast from "react-hot-toast";
import { createSharedMap } from "../../api/sharedMap";
import ModalActionButton from "../ModalActionButton/ModalActionButton";
import ShareLinkSection from "../ShareLinkSection/ShareLinkSection";
import QRCodeSection from "../QRCodeSection/QRCodeSection";
import { API_BASE_URL } from "../../constants/api";

type ShareChannel = "direct" | "x" | "line" | "email" | "qr";

/** 共有先別に URL にトラッキングパラメータを付与 */
const buildTrackedUrl = (baseUrl: string, channel: ShareChannel) => {
  if (!baseUrl) return "";
  const url = new URL(baseUrl);
  // 既存のパラメータは保持しつつ、上書き可能
  url.searchParams.set("src", channel);
  url.searchParams.set("utm_source", channel);
  url.searchParams.set("utm_medium", "share");
  url.searchParams.set("utm_campaign", "shared_map");
  return url.toString();
};

interface ShareMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  setShareUrl: React.Dispatch<React.SetStateAction<string>>;
  selectedMap: { id: number; name: string } | null;
}

const ShareMapModal: React.FC<ShareMapModalProps> = ({ 
  isOpen, 
  onClose, 
  shareUrl, 
  setShareUrl, 
  selectedMap,
}) => {
  const [channel, setChannel] = useState<ShareChannel>("direct");
  const qrWrapperRef = useRef<HTMLDivElement>(null);

  const handleCreateLink = async () => {
    if (!selectedMap) {
      toast.error("マップが選択されていません");
      return;
    }

    try {
      const res = await createSharedMap({
        mapId: selectedMap.id,
        title: selectedMap.name,
        description: "",
      });
  
      const url = `${API_BASE_URL}/shared-map/${res.share_uuid}`;
      setShareUrl(url);
      toast.success("シェアリンクを作成しました");
    } catch (error) {
      toast.error("シェアリンクの作成に失敗しました");
    }
  };

  // 表示・コピー用（選択中シェア先のトラッキング付きURL）
  const trackedUrl = useMemo(() => buildTrackedUrl(shareUrl, channel), [shareUrl, channel]);
  // QR 用は常に channel=qr を固定
  const qrUrl = useMemo(() => buildTrackedUrl(shareUrl, "qr"), [shareUrl]);

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="シェアマップ" size="md">
      {/* シェアリンク作成 */}
      {!shareUrl && (
        <ModalActionButton
          label="シェアリンクを作成する"
          onClick={handleCreateLink}
          icon={<Share2 className="w-5 h-5" />}
          size="md"
        />
      )}

      {/* URL + QRコード 表示（リンク作成後のみ表示） */}
      {shareUrl && (
        <>
          {/* シェア先セグメント切り替え */}
          <div className="mb-3">
            <label className="text-sm text-gray-700">シェア先</label>
            <div className="flex gap-2 mt-1">
              {(["direct","x","line","email","qr"] as ShareChannel[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setChannel(c)}
                  className={`px-3 py-1 rounded border ${
                    channel === c ? "bg-gray-800 text-white" : "bg-white hover:bg-gray-100"
                  }`}
                  aria-pressed={channel === c}
                >
                  {c === "direct" && "Direct"}
                  {c === "x" && "X"}
                  {c === "line" && "LINE"}
                  {c === "email" && "Email"}
                  {c === "qr" && "QR"}
                </button>
              ))}
            </div>
          </div>

          {/* 表示・コピーするのは選択中のシェア先URL */}
          <ShareLinkSection shareUrl={trackedUrl} channel={channel} />

          {/* QR は QR 固定のトラッキングURLを埋め込む */}
          <QRCodeSection qrWrapperRef={qrWrapperRef} shareUrl={qrUrl} />
        </>
      )}

    </BaseModal>
  );
};

export default ShareMapModal;
