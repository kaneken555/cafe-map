# cafe-map
カフェマップ

## 🎥 デモ / スクリーンショット
追加予定

---

## 🛠 技術スタック

| 分類           | 使用技術                            |
|----------------|-------------------------------------|
| フロントエンド | React (TypeScript), Vite            |
| バックエンド   | Django (Python), Django REST Framework |
| データベース   | PostgreSQL（Amazon RDS）            |
| インフラ       | AWS（EC2, S3, CloudFront, Route 53） |
| コンテナ       | Docker, Docker Compose              |
| APIサービス    | Google Maps API                     |

---

## 🚀 セットアップ手順

### 1. **リポジトリのクローン**
```bash
git clone https://github.com/kaneken555/cafe-map.git
cd cafe-map
```

### 2. **環境変数ファイルを作成**
.env ファイルをルートディレクトリに作成し、必要な環境変数を記述します。

```env
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_NAME=your-db
DATABASE_USER=your-user
DATABASE_PASSWORD=your-password
```

### 3. **初回セットアップ**
```bash
make up           # コンテナ起動（ビルド込み）
make deps         # 依存パッケージをインストール
make migrate      # マイグレーション適用
make createsuperuser  # 管理ユーザー作成（対話式）
make collectstatic   # 静的ファイル収集
make open         # ブラウザで開く（macOS）
```



### **よく使う Make コマンド一覧**
| コマンド                  | 説明                          |
| --------------------- | --------------------------- |
| `make up`             | コンテナ起動（ビルド込み）               |
| `make down`           | コンテナ停止                      |
| `make logs-web`       | Django のログを確認（リアルタイム）       |
| `make sh`             | Django コンテナに入る              |
| `make sh-db`          | DB コンテナに入る                  |
| `make makemigrations` | モデル変更からマイグレーション作成           |
| `make migrate`        | マイグレーション適用                  |
| `make seed`           | 初期データ投入（fixtures利用時）        |
| `make reset-db`       | DBを初期化（開発用・注意！）             |
| `make test`           | テスト実行（pytest）               |
| `make lint`           | コードチェック（ruff, black, isort） |
| `make fmt`            | 自動整形                        |



## 📦 デプロイ構成（本番環境）

| カテゴリ               | コンポーネント         | 役割                                           |
|------------------------|------------------------|------------------------------------------------|
| 静的サイトホスティング | S3                     | Reactアプリ配信（HTML/JS/CSS）                 |
| CDN / HTTPS 終端       | CloudFront             | キャッシュ・HTTPS終端・ルーティング            |
| ドメイン / DNS         | Route 53               | ドメインのDNS管理                              |
| SSL証明書管理          | ACM（us-east-1）       | CloudFront用の証明書管理                       |
| Webサーバ              | Nginx（EC2）           | APIリクエストのプロキシ・静的処理              |
| アプリケーションサーバ | Gunicorn（EC2）        | Djangoの実行環境（WSGI）                       |
| バックエンドAPI        | Django（EC2）          | ビジネスロジック・REST API                     |
| データベース           | PostgreSQL（RDS）      | 永続データ管理                                  |

