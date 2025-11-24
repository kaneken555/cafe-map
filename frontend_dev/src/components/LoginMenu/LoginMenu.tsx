// components/LoginMenu.tsx
import React from "react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

import { ArrowRightToLine, User as UserIcon, LogIn, Users, BarChart3 } from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";

interface LoginMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onGuestLogin: () => void;
  onGoogleLogin: () => void;
  onLogout: () => void;
  onOpenGroupList: () => void;
}

const LoginMenu: React.FC<LoginMenuProps> = ({
  isOpen,
  onClose,
  onGuestLogin,
  onGoogleLogin,
  onLogout,
  onOpenGroupList,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  // ✅ 共通ボタンクラスを定義
  const menuButtonClass = clsx(
    "w-full text-left px-4 py-2",
    "cursor-pointer hover:bg-gray-100",
    "flex items-center space-x-2"
  );

  return (
    <>
      {/* 背景オーバーレイ */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* メニュー本体 */}
      <div
        className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-50"
        onClick={(e) => e.stopPropagation()}
      >
        {!user ? (
          <>
            <button className={menuButtonClass} onClick={onGuestLogin}>
              <UserIcon size={16} />
              <span>ゲストユーザーとしてログイン</span>
            </button>
            <button className={menuButtonClass} onClick={onGoogleLogin}>
              <LogIn size={16} />
              <span>Googleアカウントでログイン</span>
            </button>
          </>
        ) : (
          <>
            {/* ✅ ログイン中ならグループボタンを表示 */}
            <button className={menuButtonClass} onClick={onOpenGroupList}>
              <Users size={16} />
              <span>グループ</span>
            </button>

            <button className={menuButtonClass} onClick={() => navigate("/analyze")}>
              <BarChart3 size={16} />
              <span>アナライズ</span>
            </button>

            <button className={menuButtonClass} onClick={onLogout}>
              <ArrowRightToLine size={16} />
              <span>ログアウト</span>
            </button>
          </>

        )}
      </div>
    </>
  );
};

export default LoginMenu;
