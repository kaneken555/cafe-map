// components/UserMenu.tsx
import React from "react";
import { LogIn, User as UserIcon } from "lucide-react";
import LoginMenu from "./LoginMenu";
import { googleLoginWithPopup } from "../api/auth";
import { getMapList } from "../api/map";
import { fetchGroupList } from "../api/group";
import { toast } from "react-hot-toast";
import { User as UserType } from "../types/user";
import { MapItem } from "../types/map";
import { Group } from "../types/group";
import { ICON_SIZES } from "../constants/ui";


interface Props {
  user: UserType | null;
  setUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  setMapList: React.Dispatch<React.SetStateAction<MapItem[]>>;
  setGroupList: React.Dispatch<React.SetStateAction<Group[]>>;
  isOpen: boolean;
  onToggle: () => void;
  onGuestLogin: () => void;
  onLogout: () => void;
  onOpenGroupList: () => void;
}

const UserMenu: React.FC<Props> = ({
  user,
  setUser,
  setMapList,
  setGroupList,
  isOpen,
  onToggle,
  onGuestLogin,
  onLogout,
  onOpenGroupList,
}) => {
  const handleGoogleLogin = async () => {
    toast("Googleログインを開始します（90秒以内に完了してください）", { duration: 5000 });
    const user = await googleLoginWithPopup();
    if (user) {
      setUser(user);
      // ログイン時にマップを取得する
      const maps = await getMapList();
      setMapList(maps);
      
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
        className="flex flex-col items-center justify-center px-2 py-1 border border-black rounded bg-white text-black cursor-pointer hover:bg-gray-100 w-18 h-14"
        onClick={onToggle}
        title={user ? user.name : "ログイン"}
      >
        {user ? <UserIcon size={ICON_SIZES.MEDIUM} /> : <LogIn size={ICON_SIZES.MEDIUM} />}
        <span className="text-[10px] mt-1">{user ? user.name : "ログイン"}</span>
      </button>

      {/* ▼ ドロップダウンメニュー */}
      <LoginMenu
        isOpen={isOpen}
        user={user}
        onGuestLogin={onGuestLogin}
        onGoogleLogin={handleGoogleLogin}
        onLogout={onLogout}
        onOpenGroupList={onOpenGroupList}
      />
    </div>
  );
};

export default UserMenu;
