# 📌 カフェマップ テーブル定義

## 1. `users`（ユーザー）
| カラム名        | データ型           | 制約               | 説明           |
|---------------|----------------|----------------|--------------|
| id           | BIGINT         | PRIMARY KEY    | ユーザーID  |
| name         | VARCHAR(255)   | NOT NULL       | ユーザー名  |
| email        | VARCHAR(255)   | UNIQUE NOT NULL | メールアドレス |
| password_hash | VARCHAR(255)  | NOT NULL       | パスワードハッシュ |
| created_at   | DATETIME       | DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at   | DATETIME       | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新日時 |

---

## 2. `maps`（マップ）
| カラム名     | データ型         | 制約               | 説明        |
|------------|--------------|----------------|-----------|
| id         | BIGINT       | PRIMARY KEY    | マップID  |
| name       | VARCHAR(255) | NOT NULL       | マップ名  |
| created_at | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | DATETIME     | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新日時 |

---

## 3. `map_user_relations`（マップとユーザーの関連）
| カラム名     | データ型  | 制約               | 説明             |
|------------|---------|----------------|--------------|
| id         | BIGINT  | PRIMARY KEY    | 関係ID       |
| user_id    | BIGINT  | FOREIGN KEY(users.id) | ユーザーID |
| map_id     | BIGINT  | FOREIGN KEY(maps.id) | マップID   |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 作成日時 |

---

## 4. `cafes`（カフェ）
| カラム名            | データ型         | 制約               | 説明               |
|-------------------|--------------|----------------|------------------|
| id               | BIGINT       | PRIMARY KEY    | カフェID          |
| place_id         | VARCHAR(255) | NOT NULL UNIQUE | Google Place ID  |
| name             | VARCHAR(255) | NOT NULL       | カフェ名          |
| address          | TEXT         | NOT NULL       | 住所              |
| latitude         | DECIMAL(10,7)| NOT NULL       | 緯度              |
| longitude        | DECIMAL(10,7)| NOT NULL       | 経度              |
| rating           | FLOAT        |                | 評価              |
| user_ratings_total | INT        |                | レビュー数        |
| photo_url        | VARCHAR(255) |                | 代表画像URL       |
| photo_urls       | JSON         |                | 画像URLリスト     |
| phone_number     | VARCHAR(20)  |                | 電話番号          |
| opening_hours    | TEXT         |                | 営業時間          |
| created_at       | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at       | DATETIME     | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新日時 |

---

## 5. `cafe_map_relations`（カフェとマップの関連）
| カラム名     | データ型  | 制約               | 説明             |
|------------|---------|----------------|--------------|
| id         | BIGINT  | PRIMARY KEY    | 関係ID       |
| map_id     | BIGINT  | FOREIGN KEY(maps.id) | マップID   |
| cafe_id    | BIGINT  | FOREIGN KEY(cafes.id) | カフェID   |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 作成日時 |

---

## 6. `tags`（タグ）
| カラム名     | データ型         | 制約               | 説明        |
|------------|--------------|----------------|-----------|
| id         | BIGINT       | PRIMARY KEY    | タグID     |
| name       | VARCHAR(255) | NOT NULL UNIQUE | タグ名    |
| color      | VARCHAR(10)  |                | カラーコード |
| created_at | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | DATETIME     | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新日時 |

---

## 7. `cafe_tag_relations`（カフェとタグの関連）
| カラム名     | データ型  | 制約               | 説明             |
|------------|---------|----------------|--------------|
| id         | BIGINT  | PRIMARY KEY    | 関係ID       |
| cafe_id    | BIGINT  | FOREIGN KEY(cafes.id) | カフェID   |
| tag_id     | BIGINT  | FOREIGN KEY(tags.id) | タグID     |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 作成日時 |

---

## 8. `memos`（メモ）
| カラム名     | データ型         | 制約               | 説明       |
|------------|--------------|----------------|----------|
| id         | BIGINT       | PRIMARY KEY    | メモID    |
| memo       | TEXT         | NOT NULL       | メモ内容  |
| created_at | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | DATETIME     | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新日時 |

---

## 9. `cafe_memo_relations`（カフェとメモの関連）
| カラム名     | データ型  | 制約               | 説明             |
|------------|---------|----------------|--------------|
| id         | BIGINT  | PRIMARY KEY    | 関係ID       |
| cafe_id    | BIGINT  | FOREIGN KEY(cafes.id) | カフェID   |
| memo_id    | BIGINT  | FOREIGN KEY(memos.id) | メモID     |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 作成日時 |

---

## 10. `share_maps`（共有マップ）
| カラム名     | データ型         | 制約               | 説明       |
|------------|--------------|----------------|----------|
| id         | BIGINT       | PRIMARY KEY    | 共有マップID |
| name       | VARCHAR(255) | NOT NULL       | 共有マップ名 |
| created_at | DATETIME     | DEFAULT CURRENT_TIMESTAMP | 作成日時 |
| updated_at | DATETIME     | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新日時 |

---

## 11. `cafe_share_map_relations`（カフェと共有マップの関連）
| カラム名     | データ型  | 制約               | 説明             |
|------------|---------|----------------|--------------|
| id         | BIGINT  | PRIMARY KEY    | 関係ID       |
| share_map_id | BIGINT | FOREIGN KEY(share_maps.id) | 共有マップID |
| cafe_id    | BIGINT  | FOREIGN KEY(cafes.id) | カフェID   |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | 作成日時 |

---