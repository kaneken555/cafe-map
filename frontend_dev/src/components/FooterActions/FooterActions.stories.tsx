// components/FooterActions.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";
import FooterActions from "./FooterActions";
import { AuthContext } from "../../contexts/AuthContext";
import { MapProvider, useMap } from "../../contexts/MapContext";
import type { MapItem } from "../../types/map";
import type { User } from "../../types/user";


// Storybook メタデータ
const meta: Meta<typeof FooterActions> = {
  title: "Components/FooterActions",
  component: FooterActions,
};
export default meta;

type Story = StoryObj<typeof FooterActions>;

const mockUser = { id: 1, name: "Test User" };
const mockMap: MapItem = { id: 1, name: "渋谷カフェ巡り" };

// ✅ モックAuthProvider
const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(mockUser);

  const resetAuthContext = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, setUser, resetAuthContext }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ AuthProvider + MapProvider でラップした内部コンポーネント
const WithProviders = () => {
  const [isMyCafeListOpen, setIsMyCafeListOpen] = useState(false);

  const { setSelectedMap, selectedMap, setMapMode, mapMode } = useMap();

  // 初期値をセット（例：マウント後にマップを選択済みとする）
  useEffect(() => {
    setSelectedMap(mockMap);
    setMapMode("mycafe");
  }, []);

  const handleCafeList = () => {
    setIsMyCafeListOpen((prev) => !prev);
  };

  const handleShowMyCafeMap = () => {
    setMapMode("mycafe");
  };

  const handleOpenMapList = () => {
    setSelectedMap((prev) => (prev ? null : mockMap));
  };

  // ✅ StorybookからmapModeを切り替えるボタン
  const handleChangeMapMode = (mode: "search" | "mycafe" | "share") => {
    setMapMode(mode);
  };

  return (
    <div className="h-screen bg-gray-100">
      <FooterActions
        isMyCafeListOpen={isMyCafeListOpen}
        onOpenCafeList={handleCafeList}
        onOpenMapList={handleOpenMapList}
        onShowMyCafeMap={handleShowMyCafeMap}
      />

      {/* ✅ mapMode 切り替えUI */}
      <div className="p-4">
        <p className="font-semibold mb-1">🧪 現在の状態:</p>
        <ul className="text-sm text-gray-700 list-disc ml-5 mb-2">
          <li>Cafe List Open: {isMyCafeListOpen ? "Yes" : "No"}</li>
          <li>Selected Map: {selectedMap?.name ?? "None"}</li>
          <li>Map Mode: {mapMode}</li>
        </ul>

        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-blue-500 text-white rounded"
            onClick={() => handleChangeMapMode("search")}
          >
            Mode: search
          </button>
          <button
            className="px-3 py-1 bg-green-500 text-white rounded"
            onClick={() => handleChangeMapMode("mycafe")}
          >
            Mode: mycafe
          </button>
          <button
            className="px-3 py-1 bg-purple-500 text-white rounded"
            onClick={() => handleChangeMapMode("share")}
          >
            Mode: share
          </button>
        </div>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => (
    <MockAuthProvider>
      <MapProvider>
        <WithProviders />
      </MapProvider>
    </MockAuthProvider>
  ),
};
