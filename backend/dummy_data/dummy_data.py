# dummy_data.py

# --- mock_users ---
mock_users = [
    {"id": 1, "name": "ゲストユーザー"},
    {"id": 2, "name": "テストユーザー"},
    {"id": 3, "name": "admin"},
]

# --- mock_maps ---
mock_maps = [
    {"id": 1, "user_id": 1, "name": "渋谷カフェマップ"},
    {"id": 2, "user_id": 1, "name": "東京駅カフェマップ"},
    {"id": 3, "user_id": 1, "name": "京都カフェ巡り"},
    {"id": 4, "user_id": 2, "name": "大阪カフェ巡り"},
    {"id": 5, "user_id": 2, "name": "名古屋カフェ巡り"},
    {"id": 6, "user_id": 2, "name": "福岡カフェ巡り"},
]

# --- mock_cafes ---
mock_cafes = [
    {
        "place_id": "ChIJL8g5x1lLGGAR2v4q3X9f7mA",
        "name": "スターバックス SHIBUYA TSUTAYA",
        "address": "東京都渋谷区宇田川町21-6",
        "latitude": 35.681,
        "longitude": 139.765,
        "rating": 4.5,
        "photo_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/3/3f/Starbucks_Coffee_restaurant.png",
            "https://upload.wikimedia.org/wikipedia/commons/3/3f/Starbucks_Coffee_restaurant.png",
            "https://upload.wikimedia.org/wikipedia/commons/3/3f/Starbucks_Coffee_restaurant.png",
            "https://upload.wikimedia.org/wikipedia/commons/e/e2/Doutor_Coffee_Senbayashi.jpg",
        ],
        "phone_number": "03-1234-5678",
        "opening_hours": "07:00 - 22:30",
    },
    {
        "place_id": "ChIJL8g5x1lLGGAR2v4q3X9f7mB",
        "name": "コトカフェ",
        "address": "東京都渋谷区宇田川町21-6",
        "latitude": 35.675,
        "longitude": 139.760,
        "rating": 4.5,
        "photo_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/f/fe/Doutor_Stand_Sennichimae.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/f/fe/Doutor_Stand_Sennichimae.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/e/e2/Doutor_Coffee_Senbayashi.jpg",
        ],
        "phone_number": "03-1234-5678",
        "opening_hours": "11:00 - 21:00",
    },
    {
        "place_id": "ChIJL8g5x1lLGGAR2v4q3X9f7mC",
        "name": "イノダコーヒ 本店",
        "address": "東京都渋谷区宇田川町21-6",
        "latitude": 35.681,
        "longitude": 139.760,
        "rating": 4.5,
        "photo_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/b/b7/%E3%82%A4%E3%83%8E%E3%83%80%E6%9C%AC%E5%BA%97%E5%A4%96%E8%A6%B3.JPG",
            "https://upload.wikimedia.org/wikipedia/commons/b/b7/%E3%82%A4%E3%83%8E%E3%83%80%E6%9C%AC%E5%BA%97%E5%A4%96%E8%A6%B3.JPG",
            "https://upload.wikimedia.org/wikipedia/commons/b/b7/%E3%82%A4%E3%83%8E%E3%83%80%E6%9C%AC%E5%BA%97%E5%A4%96%E8%A6%B3.JPG",
        ],
        "phone_number": "03-1234-5678",
        "opening_hours": "08:00 - 18:00",
    },
    {
        "place_id": "ChIJL8g5x1lLGGAR2v4q3X9f7mD",
        "name": "タリーズコーヒー 丸の内店",
        "address": "東京都渋谷区宇田川町21-6",
        "latitude": 35.681,
        "longitude": 139.770,
        "rating": 4.5,
        "photo_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/5/55/TULLYS-COFFEE-Toyohashi-station.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/5/55/TULLYS-COFFEE-Toyohashi-station.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/5/55/TULLYS-COFFEE-Toyohashi-station.jpg",
        ],
        "phone_number": "03-1234-5678",
        "opening_hours": "08:00 - 20:00",
    },
    {
        "place_id": "ChIJL8g5x1lLGGAR2v4q3X9f7mE",
        "name": "コメダ珈琲店 銀座店",
        "address": "東京都渋谷区宇田川町21-6",
        "latitude": 35.675,
        "longitude": 139.765,
        "rating": 4.5,
        "photo_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/9/9f/Komeda_Coffee_Higashi-Shinsaibashi.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/9/9f/Komeda_Coffee_Higashi-Shinsaibashi.jpg",
            "https://upload.wikimedia.org/wikipedia/commons/9/9f/Komeda_Coffee_Higashi-Shinsaibashi.jpg",
        ],
        "phone_number": "03-1234-5678",
        "opening_hours": "07:00 - 23:00",
    },
    {
        "place_id": "ChIJL8g5x1lLGGAR2v4q3X9f7mF",
        "name": "サンマルクカフェ 銀座店",
        "address": "東京都中央区銀座21-6",
        "latitude": 35.680,
        "longitude": 139.775,
        "rating": 4.5,
        "photo_urls": [
            "https://upload.wikimedia.org/wikipedia/commons/b/b4/Saint_Marc_Cafe_Hirakata.JPG",
            "https://upload.wikimedia.org/wikipedia/commons/b/b4/Saint_Marc_Cafe_Hirakata.JPG",
            "https://upload.wikimedia.org/wikipedia/commons/b/b4/Saint_Marc_Cafe_Hirakata.JPG",
            "https://upload.wikimedia.org/wikipedia/commons/5/55/TULLYS-COFFEE-Toyohashi-station.jpg",
        ],
        "phone_number": "03-1234-5678",
        "opening_hours": "07:00 - 21:00",
    },
]
