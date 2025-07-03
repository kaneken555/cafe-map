#!/bin/bash

# スクリプトがある場所に移動（このスクリプトがどこから実行されても安定するように）
cd "$(dirname "$0")"

echo "🚀 バックエンド（Docker）を起動します..."
docker compose up -d

echo "🌐 フロントエンド（React + Vite）を起動します..."
cd frontend_dev
npm run dev
