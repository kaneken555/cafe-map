// components/UserMenu.tsx
import React from "react";
import { LogIn, User } from "lucide-react";
import LoginMenu from "./LoginMenu";
import { googleLoginWithPopup } from "../api/auth";
import { toast } from "react-hot-toast";

interface Props {
  user: { id: number; name: string } | null;
  setUser: React.Dispatch<React.SetStateAction<{ id: number; name: string } | null>>;
  isOpen: boolean;
  onToggle: () => void;
  onGuestLogin: () => void;
  onLogout: () => void;
}

const UserMenu: React.FC<Props> = ({
  user,
  setUser,
  isOpen,
  onToggle,
  onGuestLogin,
  onLogout,
}) => {
  const handleGoogleLogin = async () => {
    toast("Googleログインを開始します（90秒以内に完了してください）", { duration: 5000 });
    const user = await googleLoginWithPopup();
    if (user) {
      setUser(user);
    } else {
      toast.error("ログインが確認できませんでした。ログイン画面を閉じて再度お試しください。");
    }    console.log("ユーザー情報:", user);
    onToggle(); // メニューを閉じる
  };

  return (
    <div className="relative">
      <button
        className="flex flex-col items-center justify-center px-2 py-1 border border-black rounded bg-white text-black cursor-pointer hover:bg-gray-100 w-18 h-14"
        onClick={onToggle}
        title={user ? user.name : "ログイン"}
      >
        {user ? <User size={24} /> : <LogIn size={24} />}
        <span className="text-[10px] mt-1">{user ? user.name : "ログイン"}</span>
      </button>

      {/* ▼ ドロップダウンメニュー */}
      <LoginMenu
        isOpen={isOpen}
        user={user}
        onGuestLogin={onGuestLogin}
        onGoogleLogin={handleGoogleLogin}
        onLogout={onLogout}
      />
    </div>
  );
};

export default UserMenu;
