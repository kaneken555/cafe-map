// components/UserMenu.tsx
import React from "react";
import clsx from "clsx";

import { LogIn, User as UserIcon } from "lucide-react";
import LoginMenu from "./LoginMenu";
import { googleLoginWithPopup } from "../api/auth";
import { getMapList, getSharedMapList } from "../api/map";
import { fetchGroupList } from "../api/group";
import { toast } from "react-hot-toast";
import { ICON_SIZES } from "../constants/ui";

// Contexts
import { useAuth } from "../contexts/AuthContext";
import { useMap } from "../contexts/MapContext";
import { useGroup } from "../contexts/GroupContext";

interface Props {
  isOpen: boolean;
  onToggle: () => void;
  onGuestLogin: () => void;
  onLogout: () => void;
  onOpenGroupList: () => void;
}

const UserMenu: React.FC<Props> = ({
  isOpen,
  onToggle,
  onGuestLogin,
  onLogout,
  onOpenGroupList,
}) => {
  const { user, setUser } = useAuth();
  const { setMapList, setSharedMapList } = useMap(); // マップリストのセット関数をコンテキストから取得
  const { setGroupList } = useGroup(); // グループリストのセット関数をコンテキストから取得

  const handleGoogleLogin = async () => {
    toast("Googleログインを開始します（90秒以内に完了してください）", { duration: 5000 });
    const user = await googleLoginWithPopup();
    if (user) {
      setUser(user);
      // ログイン時にマップを取得する
      const maps = await getMapList();
      setMapList(maps);

      // 共有マップ一覧も取得
      const sharedMaps = await getSharedMapList()
      setSharedMapList(sharedMaps);
      
      // ✅ グループ一覧も取得
      const groups = await fetchGroupList();
      setGroupList(groups);
    } else {
      toast.error("ログインが確認できませんでした。ログイン画面を閉じて再度お試しください。");
    }    
    console.log("ユーザー情報:", user);
    onToggle(); // メニューを閉じる
  };

  return (
    <div className="relative">
      <button
        className={clsx(
          "flex flex-col items-center justify-center",
          "px-2 py-1 border border-black rounded",
          "bg-white text-black hover:bg-gray-100",
          "cursor-pointer",
          "w-14 h-12 md:w-18 md:h-14"
        )}
        onClick={onToggle}
        title={user ? user.name : "ログイン"}
      >
        {user ? <UserIcon size={ICON_SIZES.MEDIUM} /> : <LogIn size={ICON_SIZES.MEDIUM} />}
        <span className="text-[8px] md:text-[10px] mt-1">{user ? user.name : "ログイン"}</span>
      </button>

      {/* ▼ ドロップダウンメニュー */}
      <LoginMenu
        isOpen={isOpen}
        onGuestLogin={onGuestLogin}
        onGoogleLogin={handleGoogleLogin}
        onLogout={onLogout}
        onOpenGroupList={onOpenGroupList}
      />
    </div>
  );
};

export default UserMenu;
