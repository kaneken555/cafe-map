// components/SharedMapSearchModal.tsx
import React, { useState } from "react";
import CloseModalButton from "./CloseModalButton"; // 共通の閉じるボタンコンポーネント

interface SharedMapSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (input: string) => void;
}

const SharedMapSearchModal: React.FC<SharedMapSearchModalProps> = ({
  isOpen,
  onClose,
  onSearch,
}) => {
  const [input, setInput] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-60">
      <div className="bg-[#fffaf0] w-[400px] p-6 rounded-lg shadow-md relative">

        <CloseModalButton onClose={onClose} /> {/* ここで共通閉じるボタンを使う */}

        <h2 className="text-lg font-bold text-[#6b4226] mb-4">シェアマップを開く</h2>
        <p className="text-sm text-gray-700 mb-2">シェアマップのURLまたはIDを入力してください</p>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border px-2 py-1 rounded mb-4"
          placeholder="https://example.com/shared-map/xxxxx"
        />
        <button
          onClick={() => onSearch(input)}
          className="w-full py-2 bg-[#FFC800] hover:bg-[#D8A900] text-black rounded font-medium cursor-pointer"
        >
          検索
        </button>
      </div>
    </div>
  );
};

export default SharedMapSearchModal;
