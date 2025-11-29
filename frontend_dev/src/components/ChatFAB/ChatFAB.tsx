// components/ChatFAB/ChatFAB.tsx
import React from "react";
import { MessageCircle } from "lucide-react";

interface ChatFABProps {
  onClick: () => void;
  isOpen: boolean;
}

const ChatFAB: React.FC<ChatFABProps> = ({ onClick, isOpen }) => {
  return (
    <button
      onClick={onClick}
      className={`
        fixed w-14 h-14 rounded-full shadow-lg
        flex items-center justify-center
        transition-all duration-300 ease-in-out
        hover:scale-110 active:scale-95
        cursor-pointer
        z-50
        ${isOpen
          ? 'bg-gray-600 hover:bg-gray-700'
          : 'bg-blue-600 hover:bg-blue-700'
        }
        text-white
        bottom-20 md:bottom-6 right-6
      `}
      aria-label={isOpen ? "チャットを閉じる" : "チャットを開く"}
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
};

export default ChatFAB;
