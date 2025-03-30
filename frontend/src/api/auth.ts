export const getCsrfToken = async () => {
  const response = await fetch("http://localhost:8000/api/csrf/", {
    credentials: "include",
  });
  const data = await response.json();
  return data.csrfToken;
};

export const guestLogin = async () => {
  try {
    const csrfToken = await getCsrfToken(); // CSRF トークンを取得

    const response = await fetch("http://localhost:8000/api/guest-login/", {
      method: "POST",
      credentials: "include", // クッキーを送信
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken, // CSRF トークンを追加
      },
    });

    if (!response.ok) {
      throw new Error("ゲストログインに失敗しました");
    }

    return await response.json(); // { token, username }
  } catch (error) {
    console.error("ゲストログインエラー:", error);
    return null;
  }
};
