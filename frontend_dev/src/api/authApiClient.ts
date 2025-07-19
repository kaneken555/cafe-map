// src/api/authApiClient.ts
import { API_BASE_PATH } from "../constants/api";

export class AuthApiClient {
  /**
   * CSRFトークンを取得
   */
  static async getCsrfToken(): Promise<string> {
    const response = await fetch(`${API_BASE_PATH}/csrf/`, {
      credentials: "include",
    });
    const data = await response.json();
    return data.csrfToken;
  }

  /**
   * ゲストログインを実行
   */
  static async guestLogin(): Promise<{ id: number; name: string } | null> {
    const csrfToken = await this.getCsrfToken();

    const response = await fetch(`${API_BASE_PATH}/guest-login/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
    });

    if (!response.ok) throw new Error("ゲストログインに失敗しました");
    return await response.json();
  }

  /**
   * Googleログイン用のポップアップ認証処理
   */
  static async googleLoginWithPopup(): Promise<{ id: number; name: string } | null> {
    return new Promise((resolve) => {
      const popup = window.open(
        `${API_BASE_PATH}/auth/login/google-oauth2/?state=popup`,
        "GoogleLogin",
        "width=500,height=600"
      );

      if (!popup) {
        resolve(null);
        return;
      }

      let maxAttempts = 45;
      let attempt = 0;

      const checkSession = async () => {
        try {
          const res = await fetch(`${API_BASE_PATH}/auth/login/success/`, {
            credentials: "include",
          });
          if (res.ok) {
            const user = await res.json();
            resolve(user);
            clearInterval(timer);
            return;
          }
        } catch (_) {
          // エラー無視
        }

        attempt += 1;
        if (attempt >= maxAttempts) {
          clearInterval(timer);
          if (!popup.closed) popup.close();
          resolve(null);
        }
      };

      const timer = setInterval(() => {
        checkSession();
      }, 2000);
    });
  }

  /**
   * ログアウト処理
   */
  static async logout(): Promise<Response> {
    const csrfToken = await this.getCsrfToken();

    return await fetch(`${API_BASE_PATH}/auth/logout/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
    });
  }
}
