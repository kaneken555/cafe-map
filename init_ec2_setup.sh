#!/bin/bash

# .env.deploy 読み込み（未設定なら）
if [ -z "$EC2_HOST" ] || [ -z "$EC2_USER" ] || [ -z "$EC2_KEY_PATH" ]; then
  if [ -f .env.deploy ]; then
    source .env.deploy
  else
    echo "❌ .env.deploy ファイルが見つかりません"
    exit 1
  fi
fi

echo "🔧 EC2にDockerおよびGitをインストールし、dockerグループに追加します..."

# リモートでセットアップ実行
ssh -i "$EC2_KEY_PATH" "$EC2_USER@$EC2_HOST" << 'EOF'
set -e

# パッケージインストール（すでに入っている場合はスキップ）
echo "📦 Docker / Git インストール中..."
sudo dnf install -y docker git libxcrypt-compat

# Dockerサービス起動と有効化
echo "🚀 Dockerサービスを起動中..."
sudo service docker start
sudo systemctl enable docker

# dockerグループがあるか確認（念のため）
if getent group docker >/dev/null; then
  echo "🔐 dockerグループにユーザーを追加中..."
  sudo usermod -aG docker $USER
  echo "⚠️ グループ変更は次回ログイン時に反映されます"
else
  echo "❌ dockerグループが見つかりません（Dockerインストールに失敗している可能性あり）"
  exit 1
fi
EOF

echo "✅ EC2上でのDocker・Gitインストールとグループ追加が完了しました"
echo "🚨 注意: グループ追加の反映にはログアウト・再ログインが必要です"
