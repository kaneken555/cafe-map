#!/bin/bash
set -e
# set -ex  # ← デバッグモード（失敗したら止まる＋実行コマンドを全部表示）

# .env.deploy の読み込み
if [ -f .env.deploy ]; then
  source .env.deploy
else
  echo "❌ .env.deploy ファイルが見つかりません"
  exit 1
fi

# 🔑 GitHub鍵転送
bash prepare-ec2-github-key.sh

# Docker イメージをビルドして保存（※既にビルド済みでもOK）
echo "🐳 Docker イメージを保存中..."
docker build --platform=linux/amd64 -t myapp-backend -f backend/Dockerfile backend
docker build --platform=linux/amd64 -t myapp-nginx -f nginx/Dockerfile nginx

# 🔐 Docker Hub にログイン
echo "🔐 Docker Hub にログイン..."
echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin

# 🏷️ イメージにタグ付け（Docker Hub 向け）
docker tag myapp-backend $DOCKERHUB_USERNAME/$DOCKERHUB_REPO_BACKEND:$DOCKERHUB_TAG
docker tag myapp-nginx $DOCKERHUB_USERNAME/$DOCKERHUB_REPO_NGINX:$DOCKERHUB_TAG

# 🚀 Docker Hub にプッシュ
echo "🚀 Docker Hub にプッシュ中..."
docker push $DOCKERHUB_USERNAME/$DOCKERHUB_REPO_BACKEND:$DOCKERHUB_TAG
docker push $DOCKERHUB_USERNAME/$DOCKERHUB_REPO_NGINX:$DOCKERHUB_TAG

# 🗃️ Docker イメージを tar ファイルに保存
docker save myapp-backend > backend.tar
docker save myapp-nginx > nginx.tar

# 📦 zipにまとめる
mkdir -p deploy_files
mv backend.tar nginx.tar deploy_files/
cp docker-compose.prod.yml deploy_files/
cp .env.deploy deploy_files/

echo "📦 deploy.zip を作成中..."
zip -r deploy.zip deploy_files

# 📤 EC2 に転送
echo "📤 EC2に転送中..."
scp deploy.zip private-ec2:/home/ec2-user/
scp deploy.sh private-ec2:/home/ec2-user/

# 🚀 デプロイスクリプト実行
echo "🚀 EC2上でデプロイスクリプトを実行中..."
ssh private-ec2 "chmod +x $DEPLOY_SCRIPT_NAME && ./deploy.sh"
