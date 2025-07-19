// src/api/auth.ts
import toast from "react-hot-toast";
import { AuthApiClient } from "./authApiClient";


export const getCsrfToken = async () => {
  return await AuthApiClient.getCsrfToken();
};


export const guestLogin = async () => {
  try {
    const data = await AuthApiClient.guestLogin();
    return data;
  } catch (error) {
    console.error("ゲストログインエラー:", error);
    toast.error("ゲストログインに失敗しました");
    return null;
  }
};


export const googleLoginWithPopup = async () => {
  const result = await AuthApiClient.googleLoginWithPopup();
  if (!result) {
    toast.error("ログインに失敗しました");
  }
  return result;
};

  
export const logout = async () => {
  try {
    const response = await AuthApiClient.logout();
    if (response.ok) {
      toast.success("ログアウトしました");
    } else {
      toast.error("ログアウトに失敗しました");
    }
  } catch (error) {
    console.error("ログアウトエラー:", error);
    toast.error("ログアウト中にエラーが発生しました");
  }
};