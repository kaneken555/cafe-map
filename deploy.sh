#!/bin/bash
set -e  # エラーが出たらスクリプト停止

echo "🚀 デプロイ開始..."

cd /home/ec2-user/myapp/

echo "📥 最新コード取得中..."
git pull origin release

echo "🛑 古いコンテナを停止中..."
docker compose -f docker-compose.prod.yml down

echo "🔧 新しいイメージをビルドして起動中..."
docker compose -f docker-compose.prod.yml up -d --build

echo "🧹 静的ファイル収集中..."
docker compose -f docker-compose.prod.yml exec web python manage.py collectstatic --noinput

echo "📦 DBマイグレーション中..."
docker compose -f docker-compose.prod.yml exec web python manage.py migrate

echo "✅ デプロイ完了"