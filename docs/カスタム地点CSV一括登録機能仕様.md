# カスタム地点CSV一括登録機能 仕様書

## 実装状況

⏳ **未実装** (フェーズ3予定)

**対象機能:** カスタム地点登録機能のインポート/エクスポート拡張

---

## 1. 機能概要

### 目的

複数のカスタム地点をCSV形式で一括登録・エクスポートできる機能を提供し、以下のユースケースに対応:

- **大量データの一括登録**: 表計算ソフトで作成した地点データを一度に登録
- **データバックアップ**: 登録済みカスタム地点をCSVでエクスポートして保存
- **データ移行**: 他サービスやアプリケーションとのデータ連携
- **テンプレート活用**: CSV テンプレートを使った効率的なデータ入力

### 主な機能

1. **CSVインポート**: CSVファイルから複数のカスタム地点を一括登録
2. **CSVエクスポート**: 登録済みカスタム地点をCSV形式でダウンロード
3. **バリデーション**: インポート時のデータ検証とエラー報告
4. **プレビュー**: インポート前のデータ確認
5. **エラーハンドリング**: 部分的な失敗時の対応

---

## 2. CSV フォーマット仕様

### 2-1. インポート用CSVフォーマット

#### 基本構造

```csv
名前,緯度,経度,種別,メモ,画像URL
東京タワー,35.6890,139.7020,photo_spot,夕日の時間帯が最も美しい,https://example.com/tower.jpg
待ち合わせ場所,35.6812,139.7671,meeting_point,駅前広場,
富士山ビューポイント,35.3606,138.7274,viewpoint,天気の良い日に最高,
```

#### フィールド定義

| カラム名 | 必須 | 型 | 制約 | 説明 | 例 |
|---------|------|-----|------|------|-----|
| `名前` | ○ | 文字列 | 最大100文字 | カスタム地点の名前 | 東京タワー |
| `緯度` | ○ | 数値 | -90 ≤ n ≤ 90 | 緯度（小数点以下6桁推奨） | 35.689000 |
| `経度` | ○ | 数値 | -180 ≤ n ≤ 180 | 経度（小数点以下6桁推奨） | 139.702000 |
| `種別` | × | 文字列 | 許可値のみ | 地点の種類（後述） | photo_spot |
| `メモ` | × | 文字列 | 最大500文字 | 地点の説明・メモ | 夕日が美しい |
| `画像URL` | × | URL | 有効なURL | 地点の画像URL | https://... |

#### 種別（place_type）の許可値

| 値 | 表示名 | 説明 |
|-----|--------|------|
| `photo_spot` | 写真スポット | 写真撮影に適した場所 |
| `meeting_point` | 待ち合わせ場所 | 待ち合わせに使う場所 |
| `viewpoint` | 景色の良い場所 | 眺めの良い場所 |
| `memorial` | 記念碑・モニュメント | 記念碑や像などのモニュメント |
| `other` | その他 | その他の地点 |
| (空欄) | - | 種別なし |

#### CSVファイルの文字エンコーディング

- **推奨**: UTF-8 (BOM付き)
- **対応**: UTF-8, Shift-JIS, EUC-JP
- **注意**: Excel で開く場合は UTF-8 BOM付きを推奨

#### CSV サンプル

**基本例:**
```csv
名前,緯度,経度,種別,メモ,画像URL
東京タワー,35.658584,139.745433,photo_spot,夕日の時間帯が最も美しい,https://example.com/tower.jpg
スカイツリー,35.710063,139.810700,viewpoint,展望台からの眺めが素晴らしい,
渋谷ハチ公前,35.659022,139.700544,meeting_point,定番の待ち合わせスポット,
```

**最小限の例（必須項目のみ）:**
```csv
名前,緯度,経度,種別,メモ,画像URL
新宿御苑,35.685175,139.710106,,,
代々木公園,35.671598,139.696305,,,
```

---

### 2-2. エクスポート用CSVフォーマット

#### 基本構造

```csv
ID,名前,緯度,経度,種別,種別表示名,メモ,画像URL,登録日時,更新日時
123,東京タワー,35.658584,139.745433,photo_spot,写真スポット,夕日の時間帯が最も美しい,https://example.com/tower.jpg,2025-11-30 10:00:00,2025-11-30 10:00:00
124,待ち合わせ場所,35.681200,139.767100,meeting_point,待ち合わせ場所,駅前広場,,2025-11-30 11:00:00,2025-11-30 11:00:00
```

#### フィールド定義

| カラム名 | 説明 | 備考 |
|---------|------|------|
| `ID` | カスタム地点のID | システム内部ID |
| `名前` | 地点名 | |
| `緯度` | 緯度 | 小数点以下6桁 |
| `経度` | 経度 | 小数点以下6桁 |
| `種別` | 種別コード | photo_spot など |
| `種別表示名` | 種別の日本語名 | 写真スポット など |
| `メモ` | メモ・説明 | |
| `画像URL` | 画像の絶対URL | |
| `登録日時` | 作成日時 | YYYY-MM-DD HH:MM:SS 形式 |
| `更新日時` | 最終更新日時 | YYYY-MM-DD HH:MM:SS 形式 |

**注意:**
- エクスポートされたCSVはそのまま再インポートできる形式ではない（IDや日時が含まれるため）
- 再インポート用にはID、種別表示名、登録日時、更新日時のカラムを削除する必要がある

---

## 3. API仕様

### 3-1. CSVインポートAPI

#### エンドポイント

```
POST /api/v1/custom-places/import-csv/
```

#### リクエスト

**Content-Type:** `multipart/form-data`

**パラメータ:**

| パラメータ名 | 型 | 必須 | 説明 |
|------------|-----|------|------|
| `file` | File | ○ | CSVファイル（.csv） |
| `map_ids` | JSON文字列 | × | 関連付けるマップIDの配列 |
| `skip_errors` | Boolean | × | エラー行をスキップして続行（デフォルト: false） |
| `dry_run` | Boolean | × | プレビューモード（実際には登録しない） |

**リクエスト例:**

```bash
curl -X POST \
  -H "X-CSRFToken: {csrf_token}" \
  -F "file=@custom_places.csv" \
  -F "map_ids=[1,3]" \
  -F "skip_errors=true" \
  http://localhost:8000/api/v1/custom-places/import-csv/
```

#### レスポンス

**成功時（200 OK）:**

```json
{
  "status": "success",
  "summary": {
    "total_rows": 10,
    "success_count": 8,
    "error_count": 2,
    "skipped_count": 2
  },
  "created_places": [
    {
      "row": 1,
      "id": 123,
      "name": "東京タワー",
      "latitude": 35.658584,
      "longitude": 139.745433
    }
  ],
  "errors": [
    {
      "row": 3,
      "error_type": "validation_error",
      "field": "latitude",
      "message": "緯度は-90から90の範囲で入力してください",
      "data": {
        "名前": "無効な地点",
        "緯度": "999",
        "経度": "139.7020"
      }
    },
    {
      "row": 5,
      "error_type": "duplicate_error",
      "message": "同じ名前と座標の地点が既に存在します",
      "existing_id": 100
    }
  ]
}
```

**プレビューモード（dry_run=true）の場合:**

```json
{
  "status": "preview",
  "summary": {
    "total_rows": 10,
    "valid_count": 8,
    "invalid_count": 2
  },
  "preview_data": [
    {
      "row": 1,
      "name": "東京タワー",
      "latitude": 35.658584,
      "longitude": 139.745433,
      "place_type": "photo_spot",
      "status": "valid"
    },
    {
      "row": 3,
      "name": "無効な地点",
      "latitude": 999,
      "status": "invalid",
      "errors": ["緯度は-90から90の範囲で入力してください"]
    }
  ]
}
```

**エラー時（400 Bad Request）:**

```json
{
  "error": "バリデーションエラー",
  "details": {
    "file": ["CSVファイルが必要です"],
    "encoding": ["ファイルのエンコーディングが不正です"]
  }
}
```

**エラー時（413 Request Entity Too Large）:**

```json
{
  "error": "ファイルサイズが大きすぎます",
  "details": {
    "max_size": "10MB",
    "current_size": "15MB"
  }
}
```

---

### 3-2. CSVエクスポートAPI

#### エンドポイント

```
GET /api/v1/custom-places/export-csv/
```

#### クエリパラメータ

| パラメータ名 | 型 | 必須 | 説明 |
|------------|-----|------|------|
| `map_id` | Integer | × | 特定マップのカスタム地点のみエクスポート |
| `place_type` | String | × | 特定種別のみエクスポート |
| `format` | String | × | `simple` (再インポート可) または `full` (デフォルト) |

**リクエスト例:**

```bash
# 全てのカスタム地点をエクスポート
curl -X GET \
  -H "X-CSRFToken: {csrf_token}" \
  http://localhost:8000/api/v1/custom-places/export-csv/

# 特定マップのカスタム地点のみエクスポート
curl -X GET \
  -H "X-CSRFToken: {csrf_token}" \
  http://localhost:8000/api/v1/custom-places/export-csv/?map_id=1

# 再インポート用のシンプル形式でエクスポート
curl -X GET \
  -H "X-CSRFToken: {csrf_token}" \
  http://localhost:8000/api/v1/custom-places/export-csv/?format=simple
```

#### レスポンス

**成功時（200 OK）:**

- **Content-Type:** `text/csv; charset=utf-8`
- **Content-Disposition:** `attachment; filename="custom_places_YYYYMMDD_HHMMSS.csv"`
- **Body:** CSV形式のデータ

**エラー時（404 Not Found）:**

```json
{
  "error": "カスタム地点が見つかりません"
}
```

---

### 3-3. CSVテンプレートダウンロードAPI

#### エンドポイント

```
GET /api/v1/custom-places/csv-template/
```

#### レスポンス

**成功時（200 OK）:**

- **Content-Type:** `text/csv; charset=utf-8`
- **Content-Disposition:** `attachment; filename="custom_places_template.csv"`
- **Body:**

```csv
名前,緯度,経度,種別,メモ,画像URL
東京タワー（サンプル）,35.658584,139.745433,photo_spot,夕日の時間帯が最も美しい,https://example.com/sample.jpg
```

---

## 4. バリデーション仕様

### 4-1. ファイルレベルのバリデーション

| 項目 | 検証内容 | エラーメッセージ |
|------|---------|----------------|
| ファイル形式 | `.csv` 拡張子 | CSVファイルを選択してください |
| ファイルサイズ | 最大10MB | ファイルサイズは10MB以下にしてください |
| 文字エンコーディング | UTF-8, Shift-JIS, EUC-JP | ファイルのエンコーディングが不正です |
| ヘッダー行 | 必須カラムの存在確認 | 必須カラム「{カラム名}」が見つかりません |
| 行数 | 最大1,000行 | 一度に登録できるのは1,000件までです |

### 4-2. 行レベルのバリデーション

| フィールド | 検証内容 | エラーメッセージ |
|-----------|---------|----------------|
| 名前 | 必須、最大100文字、空白のみ不可 | 名前は必須です / 名前は100文字以内で入力してください |
| 緯度 | 必須、数値、-90 ≤ n ≤ 90 | 緯度は必須です / 緯度は数値で入力してください / 緯度は-90から90の範囲で入力してください |
| 経度 | 必須、数値、-180 ≤ n ≤ 180 | 経度は必須です / 経度は数値で入力してください / 経度は-180から180の範囲で入力してください |
| 種別 | 許可値のいずれか or 空欄 | 種別は次のいずれかを入力してください: photo_spot, meeting_point, viewpoint, memorial, other |
| メモ | 最大500文字 | メモは500文字以内で入力してください |
| 画像URL | 有効なURL形式 or 空欄 | 画像URLは有効なURL形式で入力してください |

### 4-3. データレベルのバリデーション

| 項目 | 検証内容 | エラーメッセージ |
|------|---------|----------------|
| 重複チェック | 同じ名前・緯度・経度の組み合わせが既存データに存在 | 同じ名前と座標の地点が既に存在します（ID: {existing_id}） |
| 座標精度 | 緯度・経度が小数点以下6桁以内 | 警告: 座標の精度が高すぎます（小数点以下6桁を推奨） |

---

## 5. エラーハンドリング

### 5-1. エラー処理モード

#### デフォルトモード（skip_errors=false）

- エラーが1件でも発生した場合、**全体をロールバック**
- どの行でエラーが発生したかを報告
- ユーザーがCSVを修正して再アップロード

```json
{
  "status": "error",
  "message": "インポート中にエラーが発生しました。修正して再度アップロードしてください。",
  "summary": {
    "total_rows": 10,
    "success_count": 0,
    "error_count": 2
  },
  "errors": [...]
}
```

#### スキップモード（skip_errors=true）

- エラー行をスキップして、正常な行のみを登録
- 部分的な成功を許可
- どの行が成功・失敗したかを報告

```json
{
  "status": "partial_success",
  "message": "8件の登録に成功しました。2件のエラーをスキップしました。",
  "summary": {
    "total_rows": 10,
    "success_count": 8,
    "error_count": 2,
    "skipped_count": 2
  },
  "errors": [...]
}
```

### 5-2. エラーの種類

| エラータイプ | 説明 | 対処方法 |
|------------|------|---------|
| `validation_error` | フィールドのバリデーションエラー | 該当フィールドの値を修正 |
| `duplicate_error` | 重複データエラー | 既存データを確認して削除または名前変更 |
| `encoding_error` | 文字エンコーディングエラー | UTF-8 BOM付きで保存し直す |
| `format_error` | CSV形式エラー | カラム数やヘッダーを確認 |
| `permission_error` | 権限エラー | マップへのアクセス権限を確認 |

---

## 6. UI/UX設計

### 6-1. インポート画面

#### 画面構成

```
┌─────────────────────────────────────────────┐
│  カスタム地点CSV一括登録                      │
├─────────────────────────────────────────────┤
│                                             │
│  ① CSVファイル選択                           │
│  ┌───────────────────────────────────────┐  │
│  │ ファイルをドラッグ&ドロップ              │  │
│  │          または                        │  │
│  │      [ファイルを選択]                   │  │
│  │                                       │  │
│  │  対応形式: CSV (.csv)                  │  │
│  │  最大サイズ: 10MB                      │  │
│  │  最大行数: 1,000行                     │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  [CSVテンプレートをダウンロード]              │
│                                             │
│  ② 登録先マップ選択（任意）                  │
│  ┌───────────────────────────────────────┐  │
│  │ ☑ お気に入りカフェマップ               │  │
│  │ ☐ 東京観光スポット                     │  │
│  │ ☑ 写真スポット集                       │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ③ オプション設定                            │
│  ☑ エラー行をスキップして続行               │
│  ☐ プレビューモード（登録せずに確認のみ）    │
│                                             │
│  ④ アクション                               │
│  [キャンセル]  [プレビュー]  [インポート]    │
│                                             │
└─────────────────────────────────────────────┘
```

### 6-2. プレビュー画面

```
┌─────────────────────────────────────────────┐
│  インポートプレビュー                         │
├─────────────────────────────────────────────┤
│                                             │
│  📊 サマリー                                │
│  ┌───────────────────────────────────────┐  │
│  │ 総行数: 10                             │  │
│  │ ✅ 有効: 8件                           │  │
│  │ ❌ 無効: 2件                           │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  📋 データプレビュー                         │
│  ┌───────────────────────────────────────┐  │
│  │ 行 | 名前 | 緯度 | 経度 | 種別 | 状態   │  │
│  ├───────────────────────────────────────┤  │
│  │ 1  | 東京タワー | 35.65... | ... | ✅ │  │
│  │ 2  | スカイツリー | 35.71... | ... | ✅ │  │
│  │ 3  | 無効な地点 | 999 | ... | ❌      │  │
│  │    └─ エラー: 緯度は-90から90の範囲...  │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  [戻る]  [インポート実行]                    │
│                                             │
└─────────────────────────────────────────────┘
```

### 6-3. 結果画面

```
┌─────────────────────────────────────────────┐
│  インポート完了                              │
├─────────────────────────────────────────────┤
│                                             │
│  ✅ インポートが完了しました                 │
│                                             │
│  📊 結果サマリー                            │
│  ┌───────────────────────────────────────┐  │
│  │ 総行数: 10                             │  │
│  │ ✅ 成功: 8件                           │  │
│  │ ❌ エラー: 2件                         │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ❌ エラー詳細                              │
│  ┌───────────────────────────────────────┐  │
│  │ 行3: 緯度は-90から90の範囲で入力...     │  │
│  │ 行5: 同じ名前と座標の地点が既に存在... │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  [エラーレポートをダウンロード]              │
│  [マップを表示]  [閉じる]                    │
│                                             │
└─────────────────────────────────────────────┘
```

### 6-4. エクスポート画面

```
┌─────────────────────────────────────────────┐
│  カスタム地点CSVエクスポート                  │
├─────────────────────────────────────────────┤
│                                             │
│  ① エクスポート範囲                          │
│  ○ すべてのカスタム地点                      │
│  ○ 特定マップのみ                           │
│     ┌─────────────────────────────────┐    │
│     │ ▼ お気に入りカフェマップ          │    │
│     └─────────────────────────────────┘    │
│  ○ 特定種別のみ                             │
│     ┌─────────────────────────────────┐    │
│     │ ▼ 写真スポット                   │    │
│     └─────────────────────────────────┘    │
│                                             │
│  ② エクスポート形式                          │
│  ○ 詳細形式（ID・日時含む）                  │
│  ○ シンプル形式（再インポート可能）           │
│                                             │
│  📊 エクスポート対象                         │
│  対象件数: 123件                            │
│                                             │
│  [キャンセル]  [ダウンロード]                │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 7. フロントエンド実装

### 7-1. コンポーネント構成

```
components/
├── CustomPlaceCsvImport/
│   ├── CsvImportModal.tsx          # インポートモーダル
│   ├── CsvFileUploader.tsx         # ファイルアップローダー
│   ├── CsvPreviewTable.tsx         # プレビューテーブル
│   ├── CsvImportResult.tsx         # 結果表示
│   └── CsvImportOptions.tsx        # オプション設定
└── CustomPlaceCsvExport/
    ├── CsvExportModal.tsx          # エクスポートモーダル
    └── CsvExportOptions.tsx        # エクスポート設定
```

### 7-2. API クライアント

```typescript
// src/api/customPlaceCsvApiClient.ts

export interface CsvImportRequest {
  file: File;
  map_ids?: number[];
  skip_errors?: boolean;
  dry_run?: boolean;
}

export interface CsvImportResponse {
  status: 'success' | 'preview' | 'partial_success' | 'error';
  summary: {
    total_rows: number;
    success_count?: number;
    valid_count?: number;
    error_count: number;
    skipped_count?: number;
  };
  created_places?: Array<{
    row: number;
    id: number;
    name: string;
    latitude: number;
    longitude: number;
  }>;
  errors?: Array<{
    row: number;
    error_type: string;
    field?: string;
    message: string;
    data?: Record<string, any>;
  }>;
  preview_data?: Array<{
    row: number;
    name: string;
    latitude: number;
    longitude: number;
    place_type?: string;
    status: 'valid' | 'invalid';
    errors?: string[];
  }>;
}

export const importCustomPlacesFromCsv = async (
  request: CsvImportRequest
): Promise<CsvImportResponse> => {
  const csrfToken = await getCsrfToken();

  const formData = new FormData();
  formData.append('file', request.file);

  if (request.map_ids) {
    formData.append('map_ids', JSON.stringify(request.map_ids));
  }
  if (request.skip_errors !== undefined) {
    formData.append('skip_errors', request.skip_errors.toString());
  }
  if (request.dry_run !== undefined) {
    formData.append('dry_run', request.dry_run.toString());
  }

  const response = await fetch(
    `${API_BASE_PATH}/custom-places/import-csv/`,
    {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CSRFToken': csrfToken,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'CSVインポートに失敗しました');
  }

  return response.json();
};

export const exportCustomPlacesToCsv = async (options?: {
  map_id?: number;
  place_type?: string;
  format?: 'simple' | 'full';
}): Promise<Blob> => {
  const params = new URLSearchParams();

  if (options?.map_id) {
    params.append('map_id', options.map_id.toString());
  }
  if (options?.place_type) {
    params.append('place_type', options.place_type);
  }
  if (options?.format) {
    params.append('format', options.format);
  }

  const response = await fetch(
    `${API_BASE_PATH}/custom-places/export-csv/?${params.toString()}`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error('CSVエクスポートに失敗しました');
  }

  return response.blob();
};

export const downloadCsvTemplate = async (): Promise<Blob> => {
  const response = await fetch(
    `${API_BASE_PATH}/custom-places/csv-template/`,
    {
      method: 'GET',
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error('テンプレートのダウンロードに失敗しました');
  }

  return response.blob();
};
```

---

## 8. バックエンド実装

### 8-1. Django View

```python
# backend/cafemap/api/v1/custom_place_views.py

import csv
import io
import json
from datetime import datetime
from django.http import HttpResponse
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from cafemap.models import CustomPlace, CustomPlaceMapRelation, Map
from cafemap.serializers.custom_place_serializer import CustomPlaceSerializer


class CustomPlaceViewSet(viewsets.ModelViewSet):
    """カスタム地点 ViewSet"""

    # ... 既存のメソッド ...

    @action(detail=False, methods=['post'], url_path='import-csv')
    def import_csv(self, request):
        """CSVファイルからカスタム地点を一括登録"""

        # ファイル取得
        csv_file = request.FILES.get('file')
        if not csv_file:
            return Response(
                {'error': 'CSVファイルが必要です'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ファイルサイズチェック（10MB）
        if csv_file.size > 10 * 1024 * 1024:
            return Response(
                {
                    'error': 'ファイルサイズが大きすぎます',
                    'details': {
                        'max_size': '10MB',
                        'current_size': f'{csv_file.size / (1024 * 1024):.2f}MB'
                    }
                },
                status=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
            )

        # オプション取得
        map_ids_str = request.POST.get('map_ids', '[]')
        skip_errors = request.POST.get('skip_errors', 'false').lower() == 'true'
        dry_run = request.POST.get('dry_run', 'false').lower() == 'true'

        try:
            map_ids = json.loads(map_ids_str)
        except json.JSONDecodeError:
            map_ids = []

        # CSV読み込み
        try:
            decoded_file = csv_file.read().decode('utf-8-sig')
            csv_reader = csv.DictReader(io.StringIO(decoded_file))
        except UnicodeDecodeError:
            try:
                csv_file.seek(0)
                decoded_file = csv_file.read().decode('shift-jis')
                csv_reader = csv.DictReader(io.StringIO(decoded_file))
            except Exception:
                return Response(
                    {'error': 'ファイルのエンコーディングが不正です'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # 必須カラムチェック
        required_columns = ['名前', '緯度', '経度']
        if not all(col in csv_reader.fieldnames for col in required_columns):
            missing = [col for col in required_columns if col not in csv_reader.fieldnames]
            return Response(
                {
                    'error': '必須カラムが見つかりません',
                    'details': {'missing_columns': missing}
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # CSVデータ処理
        results = {
            'created_places': [],
            'errors': [],
            'preview_data': []
        }

        row_num = 1
        created_count = 0
        error_count = 0

        # 最大行数チェック
        rows = list(csv_reader)
        if len(rows) > 1000:
            return Response(
                {'error': '一度に登録できるのは1,000件までです'},
                status=status.HTTP_400_BAD_REQUEST
            )

        for row in rows:
            row_num += 1

            # データ抽出
            data = {
                'name': row.get('名前', '').strip(),
                'latitude': row.get('緯度', '').strip(),
                'longitude': row.get('経度', '').strip(),
                'place_type': row.get('種別', '').strip() or None,
                'memo': row.get('メモ', '').strip() or None,
            }

            # バリデーション
            try:
                # 名前チェック
                if not data['name']:
                    raise ValueError('名前は必須です')

                # 緯度・経度の数値変換
                try:
                    data['latitude'] = float(data['latitude'])
                    data['longitude'] = float(data['longitude'])
                except ValueError:
                    raise ValueError('緯度・経度は数値で入力してください')

                # 範囲チェック
                if not (-90 <= data['latitude'] <= 90):
                    raise ValueError('緯度は-90から90の範囲で入力してください')
                if not (-180 <= data['longitude'] <= 180):
                    raise ValueError('経度は-180から180の範囲で入力してください')

                # 種別チェック
                if data['place_type'] and data['place_type'] not in dict(CustomPlace.PLACE_TYPE_CHOICES):
                    raise ValueError(f'種別は次のいずれかを入力してください: {", ".join(dict(CustomPlace.PLACE_TYPE_CHOICES).keys())}')

                # 重複チェック
                existing = CustomPlace.objects.filter(
                    owner=request.user,
                    name=data['name'],
                    latitude=data['latitude'],
                    longitude=data['longitude']
                ).first()

                if existing:
                    raise ValueError(f'同じ名前と座標の地点が既に存在します（ID: {existing.id}）')

                # プレビューモード
                if dry_run:
                    results['preview_data'].append({
                        'row': row_num,
                        'status': 'valid',
                        **data
                    })
                    created_count += 1
                else:
                    # カスタム地点作成
                    custom_place = CustomPlace.objects.create(
                        owner=request.user,
                        **data
                    )

                    # マップ関連付け
                    for map_id in map_ids:
                        try:
                            map_obj = Map.objects.get(id=map_id)
                            CustomPlaceMapRelation.objects.create(
                                map=map_obj,
                                custom_place=custom_place
                            )
                        except Map.DoesNotExist:
                            pass

                    results['created_places'].append({
                        'row': row_num,
                        'id': custom_place.id,
                        'name': custom_place.name,
                        'latitude': custom_place.latitude,
                        'longitude': custom_place.longitude
                    })
                    created_count += 1

            except Exception as e:
                error_count += 1
                error_info = {
                    'row': row_num,
                    'error_type': 'validation_error',
                    'message': str(e),
                    'data': row
                }
                results['errors'].append(error_info)

                if dry_run:
                    results['preview_data'].append({
                        'row': row_num,
                        'status': 'invalid',
                        'errors': [str(e)],
                        **data
                    })
                elif not skip_errors:
                    # エラー時全体ロールバック
                    return Response(
                        {
                            'status': 'error',
                            'message': 'インポート中にエラーが発生しました。修正して再度アップロードしてください。',
                            'summary': {
                                'total_rows': len(rows),
                                'success_count': 0,
                                'error_count': error_count
                            },
                            'errors': results['errors']
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )

        # レスポンス作成
        if dry_run:
            return Response({
                'status': 'preview',
                'summary': {
                    'total_rows': len(rows),
                    'valid_count': created_count,
                    'invalid_count': error_count
                },
                'preview_data': results['preview_data']
            })
        else:
            response_status = 'success' if error_count == 0 else 'partial_success'
            message = f'{created_count}件の登録に成功しました。'
            if error_count > 0:
                message += f'{error_count}件のエラーをスキップしました。'

            return Response({
                'status': response_status,
                'message': message,
                'summary': {
                    'total_rows': len(rows),
                    'success_count': created_count,
                    'error_count': error_count,
                    'skipped_count': error_count
                },
                'created_places': results['created_places'],
                'errors': results['errors']
            })

    @action(detail=False, methods=['get'], url_path='export-csv')
    def export_csv(self, request):
        """カスタム地点をCSVでエクスポート"""

        # クエリパラメータ取得
        map_id = request.query_params.get('map_id')
        place_type = request.query_params.get('place_type')
        export_format = request.query_params.get('format', 'full')

        # データ取得
        queryset = CustomPlace.objects.filter(owner=request.user)

        if map_id:
            queryset = queryset.filter(
                map_relations__map_id=map_id
            )

        if place_type:
            queryset = queryset.filter(place_type=place_type)

        # CSV生成
        response = HttpResponse(content_type='text/csv; charset=utf-8')
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        response['Content-Disposition'] = f'attachment; filename="custom_places_{timestamp}.csv"'

        # BOM追加（Excelで正しく開くため）
        response.write('\ufeff')

        writer = csv.writer(response)

        if export_format == 'simple':
            # 再インポート可能な形式
            writer.writerow(['名前', '緯度', '経度', '種別', 'メモ', '画像URL'])
            for place in queryset:
                writer.writerow([
                    place.name,
                    place.latitude,
                    place.longitude,
                    place.place_type or '',
                    place.memo or '',
                    request.build_absolute_uri(place.image.url) if place.image else ''
                ])
        else:
            # 詳細形式
            writer.writerow([
                'ID', '名前', '緯度', '経度', '種別', '種別表示名',
                'メモ', '画像URL', '登録日時', '更新日時'
            ])
            for place in queryset:
                writer.writerow([
                    place.id,
                    place.name,
                    place.latitude,
                    place.longitude,
                    place.place_type or '',
                    place.get_place_type_display() or '',
                    place.memo or '',
                    request.build_absolute_uri(place.image.url) if place.image else '',
                    place.created_at.strftime('%Y-%m-%d %H:%M:%S'),
                    place.updated_at.strftime('%Y-%m-%d %H:%M:%S')
                ])

        return response

    @action(detail=False, methods=['get'], url_path='csv-template')
    def csv_template(self, request):
        """CSVテンプレートをダウンロード"""

        response = HttpResponse(content_type='text/csv; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename="custom_places_template.csv"'

        # BOM追加
        response.write('\ufeff')

        writer = csv.writer(response)
        writer.writerow(['名前', '緯度', '経度', '種別', 'メモ', '画像URL'])
        writer.writerow([
            '東京タワー（サンプル）',
            '35.658584',
            '139.745433',
            'photo_spot',
            '夕日の時間帯が最も美しい',
            'https://example.com/sample.jpg'
        ])

        return response
```

---

## 9. テスト仕様

### 9-1. ユニットテスト

```python
# backend/cafemap/tests/test_custom_place_csv.py

import io
import csv
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from cafemap.models import CustomPlace, Map

User = get_user_model()


class CustomPlaceCsvImportTests(TestCase):
    """CSV インポートのテスト"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(name='testuser', password='testpass')
        self.client.force_authenticate(user=self.user)
        self.map = Map.objects.create(name='テストマップ')

    def create_csv_file(self, data):
        """テスト用CSVファイルを作成"""
        output = io.StringIO()
        writer = csv.DictWriter(output, fieldnames=['名前', '緯度', '経度', '種別', 'メモ', '画像URL'])
        writer.writeheader()
        for row in data:
            writer.writerow(row)
        output.seek(0)
        return io.BytesIO(output.getvalue().encode('utf-8'))

    def test_import_valid_csv(self):
        """正常なCSVのインポート"""
        csv_data = [
            {
                '名前': '東京タワー',
                '緯度': '35.658584',
                '経度': '139.745433',
                '種別': 'photo_spot',
                'メモ': 'テストメモ',
                '画像URL': ''
            }
        ]
        csv_file = self.create_csv_file(csv_data)

        response = self.client.post(
            '/api/v1/custom-places/import-csv/',
            {'file': csv_file, 'map_ids': f'[{self.map.id}]'},
            format='multipart'
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'success')
        self.assertEqual(response.data['summary']['success_count'], 1)
        self.assertEqual(CustomPlace.objects.count(), 1)

    def test_import_invalid_latitude(self):
        """無効な緯度のエラーハンドリング"""
        csv_data = [
            {
                '名前': '無効な地点',
                '緯度': '999',
                '経度': '139.745433',
                '種別': '',
                'メモ': '',
                '画像URL': ''
            }
        ]
        csv_file = self.create_csv_file(csv_data)

        response = self.client.post(
            '/api/v1/custom-places/import-csv/',
            {'file': csv_file},
            format='multipart'
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['status'], 'error')
        self.assertIn('緯度は-90から90の範囲', response.data['errors'][0]['message'])

    def test_import_with_skip_errors(self):
        """エラースキップモード"""
        csv_data = [
            {
                '名前': '東京タワー',
                '緯度': '35.658584',
                '経度': '139.745433',
                '種別': 'photo_spot',
                'メモ': '',
                '画像URL': ''
            },
            {
                '名前': '無効な地点',
                '緯度': '999',
                '経度': '139.745433',
                '種別': '',
                'メモ': '',
                '画像URL': ''
            }
        ]
        csv_file = self.create_csv_file(csv_data)

        response = self.client.post(
            '/api/v1/custom-places/import-csv/',
            {'file': csv_file, 'skip_errors': 'true'},
            format='multipart'
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'partial_success')
        self.assertEqual(response.data['summary']['success_count'], 1)
        self.assertEqual(response.data['summary']['error_count'], 1)
        self.assertEqual(CustomPlace.objects.count(), 1)

    def test_import_dry_run(self):
        """プレビューモード"""
        csv_data = [
            {
                '名前': '東京タワー',
                '緯度': '35.658584',
                '経度': '139.745433',
                '種別': 'photo_spot',
                'メモ': '',
                '画像URL': ''
            }
        ]
        csv_file = self.create_csv_file(csv_data)

        response = self.client.post(
            '/api/v1/custom-places/import-csv/',
            {'file': csv_file, 'dry_run': 'true'},
            format='multipart'
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'preview')
        self.assertEqual(CustomPlace.objects.count(), 0)  # 実際には登録されない


class CustomPlaceCsvExportTests(TestCase):
    """CSV エクスポートのテスト"""

    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(name='testuser', password='testpass')
        self.client.force_authenticate(user=self.user)

        # テストデータ作成
        self.place1 = CustomPlace.objects.create(
            owner=self.user,
            name='東京タワー',
            latitude=35.658584,
            longitude=139.745433,
            place_type='photo_spot',
            memo='テストメモ'
        )

    def test_export_csv(self):
        """CSVエクスポート"""
        response = self.client.get('/api/v1/custom-places/export-csv/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'text/csv; charset=utf-8')
        self.assertIn('attachment', response['Content-Disposition'])

    def test_download_template(self):
        """テンプレートダウンロード"""
        response = self.client.get('/api/v1/custom-places/csv-template/')

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response['Content-Type'], 'text/csv; charset=utf-8')
        self.assertIn('custom_places_template.csv', response['Content-Disposition'])
```

---

## 10. セキュリティ考慮事項

### 10-1. 脆弱性対策

| 脅威 | 対策 |
|------|------|
| CSVインジェクション | セル値が `=`, `+`, `-`, `@` で始まる場合は先頭に `'` を追加 |
| ファイルサイズDoS | 最大10MB制限 |
| 大量データDoS | 最大1,000行制限 |
| パストラバーサル | ファイル名をサニタイズ、アップロード先を固定 |
| XSS | 出力時にHTMLエスケープ |
| CSRF | CSRFトークン検証 |

### 10-2. 権限チェック

- インポート: 認証済みユーザーのみ（自分のカスタム地点として登録）
- エクスポート: 自分が所有するカスタム地点のみエクスポート可能
- マップ関連付け: アクセス権限のあるマップのみ関連付け可能

---

## 11. パフォーマンス最適化

### 11-1. インポート最適化

- **バルクインサート**: `bulk_create()` を使用して一括登録
- **トランザクション**: 1つのトランザクションで全件登録
- **バリデーション**: シリアライザーではなく独自バリデーション（高速化）

### 11-2. エクスポート最適化

- **ストリーミング**: 大量データの場合はストリーミングレスポンス
- **select_related**: 関連データを事前取得
- **キャッシュ**: エクスポート結果を一時的にキャッシュ

---

## 12. 実装スケジュール（フェーズ3）

### Phase 1: 基本インポート機能（2週間）

- [ ] CSVパーサー実装
- [ ] バリデーション実装
- [ ] インポートAPI実装
- [ ] 基本的なUIコンポーネント

### Phase 2: エクスポート機能（1週間）

- [ ] エクスポートAPI実装
- [ ] テンプレートダウンロード機能
- [ ] UI統合

### Phase 3: 高度な機能（2週間）

- [ ] プレビューモード実装
- [ ] エラースキップモード実装
- [ ] エラーレポート機能
- [ ] UI/UX改善

### Phase 4: テスト・最適化（1週間）

- [ ] ユニットテスト作成
- [ ] 統合テスト実施
- [ ] パフォーマンステスト
- [ ] セキュリティ監査

---

## 13. 関連ドキュメント

- [カスタム地点登録機能.md](./カスタム地点登録機能.md)
- [統合API実装ガイド.md](./統合API実装ガイド.md)

---

## 14. 変更履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|---------|
| 2025-12-06 | 1.0.0 | 初版作成 - CSV一括登録機能仕様書 |
