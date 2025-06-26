#!/bin/bash

# .env.deploy 読み込み（呼び出し元で未読み込みなら）
if [ -z "$EC2_HOST" ] || [ -z "$EC2_USER" ] || [ -z "$EC2_KEY_PATH" ] || [ -z "$GITHUB_KEY_PATH" ]; then
  if [ -f .env.deploy ]; then
    source .env.deploy
  else
    echo "❌ .env.deploy ファイルが見つかりません"
    exit 1
  fi
fi



# 秘密鍵の存在チェック
if [ ! -f "$GITHUB_KEY_PATH" ]; then
  echo "❌ GitHub用秘密鍵が見つかりません: $GITHUB_KEY_PATH"
  exit 1
fi

echo "📤 GitHub用秘密鍵をEC2に転送中..."
scp -i "$EC2_KEY_PATH" "$GITHUB_KEY_PATH" $EC2_USER@$EC2_HOST:/home/$EC2_USER/.ssh/id_rsa

echo "🔧 パーミッションとSSH設定を整備中..."
ssh -i "$EC2_KEY_PATH" "$EC2_USER@$EC2_HOST" << 'EOF'
chmod 600 ~/.ssh/id_rsa

# SSH設定が未設定なら追記
if [ ! -f ~/.ssh/config ] || ! grep -q 'github.com' ~/.ssh/config; then
  echo 'Host github.com
  IdentityFile ~/.ssh/id_rsa
  StrictHostKeyChecking no' >> ~/.ssh/config
  chmod 600 ~/.ssh/config
fi
EOF

echo "✅ GitHub用鍵の転送と設定が完了しました"
