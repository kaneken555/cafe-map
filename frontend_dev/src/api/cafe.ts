// src/api/cafe.ts

export interface Cafe {
    name: string;
    openTime: string;
    status: string;
    distance: string;
    photoUrl: string;
  }

export const mockCafeData: { [key: number]: Cafe[] } = {
1: [
    {
    name: "スターバックス SHIBUYA TSUTAYA",
    openTime: "07:00 - 22:30",
    status: "現在営業中",
    distance: "1.3km",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Starbucks_Coffee_restaurant.png",
    },
    {
    name: "コトカフェ",
    openTime: "11:00 - 21:00",
    status: "現在営業中",
    distance: "1.6km",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Doutor_Coffee_Senbayashi.jpg",
    },
],
2: [
    {
    name: "イノダコーヒ 本店",
    openTime: "08:00 - 18:00",
    status: "営業時間外",
    distance: "0.8km",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b7/%E3%82%A4%E3%83%8E%E3%83%80%E6%9C%AC%E5%BA%97%E5%A4%96%E8%A6%B3.JPG",
    },
],
3: [
    {
    name: "タリーズコーヒー 丸の内店",
    openTime: "08:00 - 20:00",
    status: "現在営業中",
    distance: "1.2km",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/55/TULLYS-COFFEE-Toyohashi-station.jpg",
    },
    {
    name: "コメダ珈琲店 銀座店",
    openTime: "07:00 - 23:00",
    status: "現在営業中",
    distance: "1.5km",
    photoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Komeda_Coffee_Higashi-Shinsaibashi.jpg",
    },
],
};

// ✅ mockData を参照するだけのメソッド
export const getCafeList = async (mapId: number): Promise<Cafe[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(mockCafeData[mapId] || []), 200);
    });
};