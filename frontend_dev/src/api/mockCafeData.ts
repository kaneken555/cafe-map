// src/api/mockCafeData.ts

export interface Cafe {
    id: number;
    name: string;
    address: string;
    openTime: string;
    status: string;
    distance: string;
    price_day?: string;
    price_night?: string;
    photoUrl: string;
    rating: number;
    lat: number;
    lng: number;
  }

export const mockCafeData: { [key: number]: Cafe[] } = {
1: [
        {
        id: 1,
        name: "スターバックス SHIBUYA TSUTAYA",
        address: "東京都渋谷区宇田川町21-6",
        openTime: "07:00 - 22:30",
        status: "現在営業中",
        distance: "1.3km",
        price_day: "￥999",
        price_night: "￥999",
        rating: 4.5,
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Starbucks_Coffee_restaurant.png",
        lat: 35.681,
        lng: 139.765,
        },
        {
        id: 2,
        name: "コトカフェ",
        address: "東京都渋谷区宇田川町21-6",
        openTime: "11:00 - 21:00",
        status: "現在営業中",
        price_day: "￥999",
        price_night: "￥999",
        distance: "1.6km",
        rating: 4.5,
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Doutor_Coffee_Senbayashi.jpg",
        lat: 35.675,
        lng: 139.760,
        },
    ],
2: [
        {
        id: 1,
        name: "イノダコーヒ 本店",
        address: "東京都渋谷区宇田川町21-6",
        openTime: "08:00 - 18:00",
        status: "営業時間外",
        distance: "0.8km",
        price_day: "￥999",
        price_night: "￥999",
        rating: 4.5,
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b7/%E3%82%A4%E3%83%8E%E3%83%80%E6%9C%AC%E5%BA%97%E5%A4%96%E8%A6%B3.JPG",
        lat: 35.681,
        lng: 139.765,
        },
    ],
3: [
        {
        id: 1,
        name: "タリーズコーヒー 丸の内店",
        address: "東京都渋谷区宇田川町21-6",
        openTime: "08:00 - 20:00",
        status: "現在営業中",
        distance: "1.2km",
        price_day: "￥999",
        price_night: "￥999",
        rating: 4.5,
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/5/55/TULLYS-COFFEE-Toyohashi-station.jpg",
        lat: 35.681,
        lng: 139.765,
        },
        {
        id: 2,
        name: "コメダ珈琲店 銀座店",
        address: "東京都渋谷区宇田川町21-6",
        openTime: "07:00 - 23:00",
        status: "現在営業中",
        distance: "1.5km",
        price_day: "￥999",
        price_night: "￥999",
        rating: 4.5,
        photoUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9f/Komeda_Coffee_Higashi-Shinsaibashi.jpg",
        lat: 35.675,
        lng: 139.760,
        },
    ],
};