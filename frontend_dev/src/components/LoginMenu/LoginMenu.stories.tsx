// components/LoginMenu.stories.tsx
import { Meta, StoryObj } from "@storybook/react";
import LoginMenu from "./LoginMenu";
import { AuthContext } from "../../contexts/AuthContext";
import { useState } from "react";

const meta: Meta<typeof LoginMenu> = {
  title: "Components/LoginMenu",
  component: LoginMenu,
};

export default meta;

type Story = StoryObj<typeof LoginMenu>;

const ToggleAuthWrapper: React.FC = () => {
  const [user, setUser] = useState<{ id: number; name: string } | null>(null);

  const handleToggleAuth = () => {
    if (user) {
      setUser(null);
    } else {
      setUser({ id: 1, name: "テストユーザー" });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        resetAuthContext: () => setUser(null), // ✅ ここを追加！
      }}
    >
      <div className="space-y-2">
        <button
          onClick={handleToggleAuth}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {user ? "ログアウトする" : "ログインする"}
        </button>
        <div className="relative w-80 h-64 border p-4">
          <LoginMenu
            isOpen={true}
            onGuestLogin={() => alert("ゲストログイン")}
            onGoogleLogin={() => alert("Googleログイン")}
            onLogout={() => alert("ログアウト")}
            onOpenGroupList={() => alert("グループを開く")}
          />
        </div>
      </div>
    </AuthContext.Provider>
  );
};

export const ToggleLoginState: Story = {
  render: () => <ToggleAuthWrapper />,
};
