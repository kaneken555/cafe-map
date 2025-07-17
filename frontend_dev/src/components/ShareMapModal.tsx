// components/ShareMapModal.tsx
import React, { useRef } from "react";
import { Share2 } from "lucide-react";
import BaseModal from "./BaseModal/BaseModal";
import toast from "react-hot-toast";
import { createSharedMap } from "../api/sharedMap";
import ModalActionButton from "./ModalActionButton/ModalActionButton";
import ShareLinkSection from "./ShareLinkSection/ShareLinkSection";
import QRCodeSection from "./QRCodeSection/QRCodeSection";
import { API_BASE_URL } from "../constants/api";


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


  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="シェアマップ" size="md">

      {/* シェアリンクを作成するボタン */}
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
          <ShareLinkSection shareUrl={shareUrl} />
          <QRCodeSection qrWrapperRef={qrWrapperRef} shareUrl={shareUrl} />
        </>
      )}

    </BaseModal>
  );
};

export default ShareMapModal;
