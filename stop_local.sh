#!/bin/bash

# スクリプトのあるディレクトリに移動
cd "$(dirname "$0")"

echo "🛑 バックエンド（Docker）を停止します..."
docker compose down

# フロントエンド（Vite開発サーバー）の停止案内
echo "⚠️ フロントエンド（Vite）は Ctrl+C で停止してください（別ターミナルで実行しているため）"
