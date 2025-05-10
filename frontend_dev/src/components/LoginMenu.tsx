// components/LoginMenu.tsx
import React from "react";
import { ArrowRightToLine, User as UserIcon, LogIn, Users } from "lucide-react";
import toast from "react-hot-toast";
import { User as UserType } from "../types/user";


interface LoginMenuProps {
  isOpen: boolean;
  user: UserType | null;
  onGuestLogin: () => void;
  onGoogleLogin: () => void;
  onLogout: () => void;
}

const LoginMenu: React.FC<LoginMenuProps> = ({ isOpen, user, onGuestLogin, onGoogleLogin, onLogout }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-50">
      {!user ? (
        <>
          <button
            className="w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center space-x-2"
            onClick={onGuestLogin}
          >
            <UserIcon size={16} />
            <span>ゲストユーザーとしてログイン</span>
          </button>
          <button
            className="w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center space-x-2"
            onClick={onGoogleLogin}
          >
            <LogIn size={16} />
            <span>Googleアカウントでログイン</span>
          </button>
        </>
      ) : (
        <>
          {/* ✅ ログイン中ならグループボタンを表示 */}
          <button
            className="w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center space-x-2"
            onClick={() => {
              toast("グループ機能は未実装です");
            }}
          >
            <Users size={16} />
            <span>グループ</span>
          </button>
          
          <button
            className="w-full text-left px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center space-x-2"
            onClick={onLogout}
          >
            <ArrowRightToLine size={16} />
            <span>ログアウト</span>
          </button>
        </>

      )}
    </div>
  );
};

export default LoginMenu;
