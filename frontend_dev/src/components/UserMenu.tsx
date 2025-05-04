// components/UserMenu.tsx
import React from "react";
import { LogIn } from "lucide-react";
import LoginMenu from "./LoginMenu";
import { googleLogin } from "../api/auth";

interface Props {
  user: { id: number; name: string } | null;
  isOpen: boolean;
  onToggle: () => void;
  onGuestLogin: () => void;
  onLogout: () => void;
}

const UserMenu: React.FC<Props> = ({
  user,
  isOpen,
  onToggle,
  onGuestLogin,
  onLogout,
}) => {
  const handleTestLogin = () => {
    googleLogin();
    onToggle(); // メニューを閉じる
  };

  return (
    <div className="relative">
      <button
        className="flex flex-col items-center justify-center px-2 py-1 border border-black rounded bg-white text-black cursor-pointer hover:bg-gray-100 w-18 h-14"
        onClick={onToggle}
        title={user ? user.name : "ログイン"}
      >
        <LogIn size={24} />
        <span className="text-[10px] mt-1">{user ? user.name : "ログイン"}</span>
      </button>

      {/* ▼ ドロップダウンメニュー */}
      <LoginMenu
        isOpen={isOpen}
        user={user}
        onGuestLogin={onGuestLogin}
        onTestLogin={handleTestLogin}
        onLogout={onLogout}
      />
    </div>
  );
};

export default UserMenu;
