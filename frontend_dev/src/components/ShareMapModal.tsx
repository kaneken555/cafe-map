// components/ShareMapModal.tsx
import React, { useRef } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { createSharedMap } from "../api/sharedMap";
import ShareLinkSection from "./ShareLinkSection";
import QRCodeSection from "./QRCodeSection";


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
        <button 
          onClick={onClose} 
          className="absolute top-2 right-3 text-lg font-bold text-[#6b4226] hover:text-black cursor-pointer"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-[#6b4226]">シェアマップ</h2>

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
