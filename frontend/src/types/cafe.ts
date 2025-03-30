// types/cafe.ts

// APIに送信するためのカフェ情報（DBに保存する用）
export interface CafeData {
    name: string;
    address: string;
    placeId: string;
    rating?: number;
    opening_hours?: string[];
    photos?: string[];
    latitude: number;  // ✅ 追加
    longitude: number;
  }
  
  // Reactコンポーネントで使うprops用の型
  export interface CafeDetailProps extends CafeData {
    onClose: () => void;
    selectedMap: { id: number; name: string } | null;
  }
  