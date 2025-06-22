#!/bin/bash
set -e  # エラーが出たらスクリプト停止

echo "🚀 デプロイ開始..."

# パッケージリストを更新
# sudo dnf update -y

# Gitがインストールされているかチェック
if ! command -v git &> /dev/null; then
    echo "📦 Gitがインストールされていません。インストール中..."
    sudo dnf install git -y  # Gitをインストール
else
    echo "📦 Gitはすでにインストールされています。"
fi

# `libcrypt` ライブラリを含むパッケージをインストール
sudo dnf install libxcrypt-compat -y

# Dockerのインストール
echo "📦 Dockerをインストール中..."
sudo dnf install docker -y

# Dockerサービスの起動
echo "🚀 Dockerサービスを起動中..."
sudo service docker start

# Dockerを自動起動するように設定
sudo systemctl enable docker

# Docker Composeの最新バージョンをインストール
echo "📦 Docker Composeをインストール中..."
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 実行権限を与える
sudo chmod +x /usr/local/bin/docker-compose

# インストールの確認
docker --version
docker compose --version


# 必要な環境変数を読み込む
if [ -f /home/ec2-user/.env.deploy ]; then
  source /home/ec2-user/.env.deploy
else
  echo "❌ .env.deploy ファイルが見つかりません"
  exit 1
fi


# アプリケーションディレクトリへ移動
cd /home/ec2-user/myapp/


# 1. GitHubのホスト鍵を~/.ssh/known_hostsに追加
echo "📡 GitHubのホスト鍵を~/.ssh/known_hostsに追加中..."
ssh-keyscan github.com >> ~/.ssh/known_hosts

# 2. GitHubへの接続テスト
# echo "📡 GitHubへの接続テスト中..."
# ssh -T -o BatchMode=yes git@github.com
# if [ $? -eq 1 ]; then
#     echo "❌ GitHubへの接続に失敗しました。公開鍵がGitHubに追加されているか確認してください。"
#     exit 1
# else
#     echo "✅ GitHubへの接続成功！"
# fi

# 3. リポジトリのクローン
REPO_URL="git@github.com:$REPO_OWNER/$REPO_NAME.git"
# リポジトリが存在しない場合にのみクローン
if [ ! -d "$REPO_DIR" ]; then
    echo "📥 リポジトリをクローン中..."
    git clone -b $BRANCH $REPO_URL
elif [ -d "$REPO_DIR/.git" ]; then
    echo "📥 最新コード取得中..."
    cd "$REPO_DIR"
    git fetch origin $BRANCH
    git pull origin $BRANCH
    cd ..
else
    echo "⚠️ '$REPO_DIR' は存在しますがGitリポジトリではありません。削除または修正してください。"
    exit 1
fi

cd /home/ec2-user/myapp/cafe-map

# 4. 古いコンテナを停止
echo "🛑 古いコンテナを停止中..."
sudo docker-compose -f docker-compose.prod.yml down

# 5. 新しいイメージをビルドして起動
echo "🔧 新しいイメージをビルドして起動中..."
sudo docker-compose -f docker-compose.prod.yml up -d --build

# 6. 静的ファイル収集
echo "🧹 静的ファイル収集中..."
sudo docker-compose -f docker-compose.prod.yml exec web python manage.py collectstatic --noinput

# 7. DBマイグレーション
echo "📦 DBマイグレーション中..."
sudo docker-compose -f docker-compose.prod.yml exec web python manage.py migrate

echo "✅ デプロイ完了"