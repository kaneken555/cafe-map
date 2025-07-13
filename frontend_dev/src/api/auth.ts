// src/api/auth.ts
import toast from "react-hot-toast";


export const getCsrfToken = async () => {
  const response = await fetch(`/api/csrf/`, 
    {
      credentials: "include",
    }
  );
  const data = await response.json();
  return data.csrfToken;
};


export const guestLogin = async () => {
  try {
    const csrfToken = await getCsrfToken(); // CSRF トークンを取得

    const response = await fetch(`/api/guest-login/`, 
      {
        method: "POST",
        credentials: "include", // クッキーを送信
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken, // CSRF トークンを追加
        },
      }
    );

    if (!response.ok) {
      throw new Error("ゲストログインに失敗しました");
    }

    return await response.json(); // { token, username }
  } catch (error) {
    console.error("ゲストログインエラー:", error);
    return null;
  }
};


export const googleLoginWithPopup = (): Promise<{ id: number; name: string } | null> => {
  return new Promise((resolve) => {
    const popup = window.open(
      `/api/auth/login/google-oauth2/?state=popup`,
      "GoogleLogin",
      "width=500,height=600"
    );

    if (!popup) {
      console.error("ポップアップがブロックされました");
      toast.error("ポップアップがブロックされました");
      resolve(null);
      return;
    }

    let maxAttempts = 45;
    let attempt = 0;

    const checkSession = async () => {
      try {
        const res = await fetch(`/api/auth/login/success/`, 
          {
            credentials: "include",
          }
        );
        if (res.ok) {
          const user = await res.json();
          console.log("✅ ログイン成功:", user);
          resolve(user);
          clearInterval(timer);
          return;
        }
      } catch (err) {
        console.error("セッション確認エラー:", err);
      }

      attempt += 1;
      if (attempt >= maxAttempts) {
        console.warn("⏱ ログイン確認タイムアウト");
        clearInterval(timer);
        if (!popup.closed) popup.close(); // ✅ ポップアップを閉じる
        resolve(null);
      }
    };

    const timer = setInterval(() => {
      checkSession();
    }, 2000);
  });
};

  
export const logout = async () => {
  console.log("ログアウト処理を実行中...");

  try {
    const csrfToken = await getCsrfToken(); // ✅ CSRFトークンを取得

    const response = await fetch(`/api/auth/logout/`, 
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
      }
    );

    if (response.ok) {
      toast.success("ログアウトしました");
    } else {
      toast.error("ログアウトに失敗しました");
    }
  } catch (error) {
    console.error("ログアウト中にエラーが発生しました:", error);
    toast.error("ログアウトエラー");
  }
};