// utils/mapUtils.ts
import { toast } from "react-hot-toast";

/**
 * マップが選択されているかを確認し、選択されていれば action を実行。
 */
export const requireMapSelected = (
  selectedMap: any,
  action: () => void
): void => {
  if (!selectedMap) {
    toast.error("マップを選択してください");
    return;
  }
  action();
};
