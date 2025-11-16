const base = import.meta.env.VITE_API_URL ?? "";
const version = import.meta.env.VITE_API_VERSION ?? "v1";

export const API_BASE_PATH = `/api/${version}`;
export const API_BASE_URL = `${base}${API_BASE_PATH}`;

// フロントエンドのベースURL（シェアリンク用）
export const FRONTEND_BASE_URL = import.meta.env.VITE_FRONTEND_URL ?? window.location.origin;
