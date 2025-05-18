// components/ShareMapModal.tsx
import React, { useRef } from "react";
import { X, Copy } from "lucide-react";
import toast from "react-hot-toast";
import { QRCode } from "react-qrcode-logo";
import { createSharedMap } from "../api/sharedMap";


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

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("URLをコピーしました");
  };

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

  const handleSaveQrImage = () => {    
    const canvas = qrWrapperRef.current?.querySelector("canvas");
    if (!canvas) {
      toast.error("QRコードが見つかりませんでした");
      return;
    }
  
    const image = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = image;
    a.download = "share_map_qr.png";
    a.click();
    toast.success("QRコードを保存しました");
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
            <div className="mb-4">
              <label className="text-sm text-gray-700">URL</label>
              <div className="flex mt-1">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-grow border px-2 py-1 rounded-l"
                />
                <button
                  onClick={handleCopy}
                  className="bg-gray-200 hover:bg-gray-300 px-2 rounded-r cursor-pointer"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-700">QR</div>
            <div ref={qrWrapperRef} className="mt-1 p-4 bg-white rounded border flex justify-center">
              <QRCode value={shareUrl} size={128} />
            </div>
            <div className="mt-3 flex justify-center">
            <button
              onClick={handleSaveQrImage}
              className="px-4 py-1 bg-gray-200 hover:bg-gray-300 text-sm rounded cursor-pointer"
            >
              QRコードを保存
            </button>
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShareMapModal;
