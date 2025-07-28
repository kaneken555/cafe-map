// src/components/Header.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import Header from "./Header";
import { useState } from "react";
import { AuthProvider } from "../../contexts/AuthContext";
import { CafeProvider } from '../../contexts/CafeContext';
import { MapProvider } from "../../contexts/MapContext";
import { GroupProvider } from "../../contexts/GroupContext";
import { MapItem } from "../../types/map";

const meta: Meta<typeof Header> = {
  title: "Header",
  component: Header,
};

export default meta;
type Story = StoryObj<typeof Header>;

// モックユーザー
const mockUser = { id: 1, name: "山田 太郎" };

// モックマップ
const mockMapList: MapItem[] = [
  { id: 1, name: "原宿カフェマップ" },
  { id: 2, name: "中目黒マップ" },
];

// 共通ラッパー（user を動的に指定可能に）
const Wrapper: React.FC<{
  children: React.ReactNode;
  user?: any;
}> = ({ children, user = null }) => (
  <AuthProvider valueOverride={{ user }}>
    <MapProvider
      valueOverride={{
        mapList: mockMapList,
        selectedMap: mockMapList[0],
        mapMode: "mycafe",
      }}
    >
      <CafeProvider>
        <GroupProvider>{children}</GroupProvider>
      </CafeProvider>
    </MapProvider>
  </AuthProvider>
);

// ✅ ログイン状態
export const LoggedIn: Story = {
  render: () => {
    const [_shareUuid, setShareUuid] = useState<string | null>(null);
    const [isMyCafeListOpen, setIsMyCafeListOpen] = useState(false);

    return (
      <Wrapper user={mockUser}>
        <Header
          closeCafeListPanel={() => setIsMyCafeListOpen(false)}
          isMyCafeListOpen={isMyCafeListOpen}
          setShareUuid={setShareUuid}
          onOpenCafeList={() => setIsMyCafeListOpen(true)}
          onShowMyCafeMap={() => console.log("MyCafeMap表示")}
          onOpenMapList={() => console.log("MapList表示")}
        />
      </Wrapper>
    );
  },
};

// ✅ 未ログイン状態（user=null）
export const NotLoggedIn: Story = {
  render: () => {
    const [_shareUuid, setShareUuid] = useState<string | null>(null);
    const [isMyCafeListOpen, setIsMyCafeListOpen] = useState(false);

    return (
      <Wrapper user={null}>
        <Header
          closeCafeListPanel={() => setIsMyCafeListOpen(false)}
          isMyCafeListOpen={isMyCafeListOpen}
          setShareUuid={setShareUuid}
          onOpenCafeList={() => setIsMyCafeListOpen(true)}
          onShowMyCafeMap={() => console.log("MyCafeMap表示")}
          onOpenMapList={() => console.log("MapList表示")}
        />
      </Wrapper>
    );
  },
};