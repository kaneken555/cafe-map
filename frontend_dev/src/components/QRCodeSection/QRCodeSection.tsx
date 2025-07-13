// component/QRCodeSection.tsx
import React from "react";
import { QRCode } from "react-qrcode-logo";
import toast from "react-hot-toast";

const QRCodeSection: React.FC<{ 
  qrWrapperRef: React.RefObject<HTMLDivElement | null>;
  shareUrl: string 
}> = ({
  qrWrapperRef,
  shareUrl,
}) => {
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
    <>
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
  );
};

export default QRCodeSection;
