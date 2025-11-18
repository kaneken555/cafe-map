#!/bin/bash
set -e  # エラーが出たらスクリプト停止
# set -ex  # ← デバッグモード（失敗したら止まる＋実行コマンドを全部表示）

echo "🚀 デプロイ開始..."

cd /home/ec2-user
sudo rm -rf deploy_files
unzip -o deploy.zip

cd deploy_files

# 🔐 secretsディレクトリから.env.deployをコピー
if [ -f /home/ec2-user/secrets/.env.deploy ]; then
    cp /home/ec2-user/secrets/.env.deploy .env.deploy
    echo "✅ .env.deploy を deploy_files に配置しました"
else
    echo "❌ /home/ec2-user/secrets/.env.deploy が見つかりません"
    exit 1
fi

# Dockerイメージ読み込み
echo "📦 Dockerイメージを読み込み中..."
sudo docker load < backend.tar
sudo docker load < nginx.tar


# 3. 古いコンテナを停止
echo "🛑 古いコンテナを停止中..."
sudo docker-compose -f docker-compose.prod.yml down

# 4. 新しいイメージをビルドして起動
echo "🔧 新しいイメージをビルドして起動中..."
sudo docker-compose -f docker-compose.prod.yml up -d --build

# 5. 静的ファイル収集
echo "🧹 静的ファイル収集中..."
sudo docker-compose -f docker-compose.prod.yml exec -T backend python manage.py collectstatic --noinput

# 6. DBマイグレーション
echo "📦 DBマイグレーション中..."
sudo docker-compose -f docker-compose.prod.yml exec -T backend python manage.py migrate

echo "✅ デプロイ完了"