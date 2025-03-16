export const guestLogin = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/guest-login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("ゲストログインに失敗しました");
      }
  
      return await response.json(); // { token, username }
    } catch (error) {
      console.error(error);
      return null;
    }
  };
  