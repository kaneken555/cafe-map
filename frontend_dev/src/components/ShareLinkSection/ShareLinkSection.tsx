// component/ShareLinkSection.tsx
import React from "react";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";

const ShareLinkSection: React.FC<{ shareUrl: string }> = ({ shareUrl }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("URLをコピーしました");
  };

  return (
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
  );
};

export default ShareLinkSection;
