#!/bin/bash

# ローカルスクリプトの最初に追加
if [ -f .env.deploy ]; then
  source .env.deploy
else
  echo "❌ .env.deploy ファイルが見つかりません"
  exit 1
fi

# GitHub用SSH秘密鍵をEC2に転送
echo "📤 GitHub用SSH秘密鍵をEC2に転送中..."
scp -i $KEY_PATH ~/.ssh/id_rsa $EC2_USER@$EC2_HOST:/home/$EC2_USER/.ssh/id_rsa

# ディレクトリ権限設定
echo "📂 EC2上で秘密鍵の権限を設定中..."
ssh -i $KEY_PATH $EC2_USER@$EC2_HOST "chmod 600 /home/$EC2_USER/.ssh/id_rsa"


echo "📤 デプロイスクリプトをEC2に送信中..."
scp -i $KEY_PATH $SCRIPT_NAME $EC2_USER@$EC2_HOST:/home/$EC2_USER/

# 先にディレクトリを作成
ssh -i $KEY_PATH $EC2_USER@$EC2_HOST "mkdir -p /home/$EC2_USER/myapp/$REPO_DIR"
# .env.deployファイルをEC2に転送
echo "📤 .env をEC2に転送中..."
scp -i $KEY_PATH .env.deploy $EC2_USER@$EC2_HOST:/home/$EC2_USER/myapp/$REPO_DIR/.env.deploy

echo "📡 EC2上でデプロイスクリプトを実行中..."
ssh -i $KEY_PATH $EC2_USER@$EC2_HOST "chmod +x $SCRIPT_NAME && ./deploy.sh"