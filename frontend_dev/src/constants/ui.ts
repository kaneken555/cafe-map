// constants/ui.ts
// アイコンサイズ
export const ICON_SIZES = {
  SMALL: 16,
  MEDIUM: 24,
  LARGE: 30,
};

// モーダルのスタイル
export const MODAL_STYLES = {
  // メインモーダル用
  MAIN_MODAL: {
    CONTAINER: "fixed inset-0 bg-black/30 flex justify-center items-center z-50", // メインモーダルの背景と z-index
    TITLE: "text-xl font-bold text-[#6b4226] mb-4",
    INPUT: "w-full px-4 py-2 border rounded mb-4",
  },

  // サブモーダル用（グループ参加など）
  SUB_MODAL: {
    CONTAINER: "fixed inset-0 bg-black/30 flex justify-center items-center z-60", // サブモーダルの z-index はメインより低く
    TITLE: "text-lg font-bold text-[#6b4226] mb-4",
    INPUT: "w-full px-4 py-2 border rounded mb-4",
  },
};