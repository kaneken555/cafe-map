import React, { useState } from "react";
import { guestLogin } from "../api/auth";

const GuestLoginButton: React.FC<{ setLoggedIn: (status: boolean) => void }> = ({ setLoggedIn }) => {
  const [loading, setLoading] = useState(false);

  const handleGuestLogin = async () => {
    setLoading(true);
    const result = await guestLogin();

    if (result) {
      localStorage.setItem("token", result.token);
      setLoggedIn(true);
    } else {
      alert("ログインに失敗しました");
    }
    setLoading(false);
  };

  return (
    <button onClick={handleGuestLogin} disabled={loading}>
      {loading ? "ログイン中..." : "ゲストユーザーとしてログインする"}
    </button>
  );
};

export default GuestLoginButton;
