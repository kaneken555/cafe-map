#!/bin/bash
set -e  # エラーが出たらスクリプト停止

echo "🚀 デプロイ開始..."


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


# 📝 実行ユーザーのホームディレクトリを使用（/home/ec2-user や /home/ubuntu に対応）
USER_HOME=$(eval echo ~$USER)

# 必要な環境変数を読み込む
if [ -f $USER_HOME/.env.deploy ]; then
  source $USER_HOME/.env.deploy
else
  echo "❌ .env.deploy ファイルが見つかりません"
  exit 1
fi

# アプリケーションディレクトリを作成（存在しない場合）
mkdir -p $USER_HOME/myapp
# アプリケーションディレクトリへ移動
cd $USER_HOME/myapp/


# 1. GitHubのホスト鍵を~/.ssh/known_hostsに追加
echo "📡 GitHubのホスト鍵を~/.ssh/known_hostsに追加中..."
ssh-keyscan github.com >> ~/.ssh/known_hosts


# 2. リポジトリのクローン
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

cp $USER_HOME/.env.deploy $USER_HOME/myapp/$REPO_DIR/.env.deploy

cd $USER_HOME/myapp/$REPO_DIR

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