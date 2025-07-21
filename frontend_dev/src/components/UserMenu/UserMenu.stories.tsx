// components/UserMenu/UserMenu.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import UserMenu from "./UserMenu";
import { useState } from "react";

// コンテキスト
import { AuthProvider } from "../../contexts/AuthContext";
import { MapProvider } from "../../contexts/MapContext";
import { GroupProvider } from "../../contexts/GroupContext";
import { CafeProvider } from "../../contexts/CafeContext";
import { MapItem } from "../../types/map";
import { User } from "../../types/user";

const meta: Meta<typeof UserMenu> = {
  title: "UserMenu",
  component: UserMenu,
};

export default meta;
type Story = StoryObj<typeof UserMenu>;

// ✅ モックユーザー
const mockUser: User = {
  id: 1,
  name: "山田 太郎",
};

// ✅ モックマップ
const mockMapList: MapItem[] = [
  { id: 1, name: "原宿カフェマップ" },
  { id: 2, name: "中目黒マップ" },
];

// ✅ 共通ラッパー（ログイン状態を切り替え可能）
const Wrapper: React.FC<{
  children: React.ReactNode;
  user?: User | null;
}> = ({ children, user = null }) => (
  <AuthProvider valueOverride={{ user }}>
    <MapProvider valueOverride={{ mapList: mockMapList, selectedMap: mockMapList[0], mapMode: "mycafe" }}>
      <CafeProvider>
        <GroupProvider>{children}</GroupProvider>
      </CafeProvider>
    </MapProvider>
  </AuthProvider>
);

// ✅ ログイン状態
export const LoggedIn: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Wrapper user={mockUser}>
        <UserMenu
          isOpen={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
          onGuestLogin={() => alert("ゲストログイン")}
          onLogout={() => alert("ログアウト")}
          onOpenGroupList={() => alert("グループリストを開く")}
        />
      </Wrapper>
    );
  },
};

// ✅ 未ログイン状態
export const NotLoggedIn: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <Wrapper user={null}>
        <UserMenu
          isOpen={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
          onGuestLogin={() => alert("ゲストログイン")}
          onLogout={() => alert("ログアウト")}
          onOpenGroupList={() => alert("グループリストを開く")}
        />
      </Wrapper>
    );
  },
};
