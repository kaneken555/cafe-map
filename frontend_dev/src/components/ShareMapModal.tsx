// components/ShareMapModal.tsx
import React, { useRef } from "react";
import toast from "react-hot-toast";
import { createSharedMap } from "../api/sharedMap";
import CloseModalButton from "./CloseModalButton";
import ShareLinkSection from "./ShareLinkSection";
import QRCodeSection from "./QRCodeSection";
import { MODAL_STYLES } from "../constants/ui";

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

  if (!isOpen) return null;

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
  
      const url = `https://your-domain.com/shared-map/${res.share_uuid}`;
      setShareUrl(url);
      toast.success("シェアリンクを作成しました");
    } catch (error) {
      toast.error("シェアリンクの作成に失敗しました");
    }

  };


  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-[#fef7ec] p-6 rounded-lg w-[360px] relative shadow-md">

        <CloseModalButton onClose={onClose} /> {/* ここで共通閉じるボタンを使う */}

        <h2 className={MODAL_STYLES.TITLE}>シェアマップ</h2>

        {/* シェアリンクを作成するボタン */}
        {!shareUrl && (
          <button
            onClick={handleCreateLink}
            className="w-full px-4 py-2 bg-[#FFC800] hover:bg-[#D8A900] cursor-pointer text-black rounded"
            >
            シェアリンクを作成する
          </button>
        )}

        {/* URL + QRコード 表示（リンク作成後のみ表示） */}
        {shareUrl && (
          <>
            <ShareLinkSection shareUrl={shareUrl} />
            <QRCodeSection qrWrapperRef={qrWrapperRef} shareUrl={shareUrl} />
          </>
        )}
      </div>
    </div>
  );
};

export default ShareMapModal;
