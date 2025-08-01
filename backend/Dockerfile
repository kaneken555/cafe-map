# ============================
# ステージ1: ビルドステージ
# ============================
FROM python:3.10 AS builder

WORKDIR /app

# PostgreSQLクライアントなどのビルド用パッケージ
RUN apt-get update && apt-get install -y postgresql-client

# 依存ファイルをコピーしてpip install（--userでローカルにインストール）
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --user --no-cache-dir -r requirements.txt


# ============================
# ステージ2: 実行ステージ（軽量）
# ============================
FROM python:3.10-slim

WORKDIR /app

# 必要なクライアントツールを追加（←重要！）
RUN apt-get update && apt-get install -y postgresql-client && rm -rf /var/lib/apt/lists/*

# pipでインストールされたパスを環境変数に追加
ENV PATH="/root/.local/bin:$PATH"

# ビルドステージから必要なパッケージだけをコピー
COPY --from=builder /root/.local /root/.local

# アプリケーションコードをコピー
COPY . .

# entrypoint.sh をコピーし、実行権限を付与
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
