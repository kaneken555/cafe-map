#!/bin/bash

# .env.deploy の読み込み
if [ -f .env.deploy ]; then
  source .env.deploy
else
  echo "❌ .env.deploy ファイルが見つかりません"
  exit 1
fi

# 🔑 GitHub用秘密鍵の転送処理（外部スクリプトを呼ぶ）
bash prepare-ec2-github-key.sh

# 📤 デプロイスクリプトをEC2に送信
echo "📤 デプロイスクリプトをEC2に送信中..."
scp -i $KEY_PATH $DEPLOY_SCRIPT_NAME $EC2_USER@$EC2_HOST:/home/$EC2_USER/

# 📂 必要なディレクトリをEC2上に作成
# ssh -i $KEY_PATH $EC2_USER@$EC2_HOST "mkdir -p /home/$EC2_USER/myapp/$REPO_DIR"

# 📤 .env.deploy をEC2に送信
echo "📤 .env をEC2に転送中..."
# scp -i $KEY_PATH .env.deploy $EC2_USER@$EC2_HOST:/home/$EC2_USER/myapp/$REPO_DIR/.env.deploy
scp -i $KEY_PATH .env.deploy $EC2_USER@$EC2_HOST:/home/$EC2_USER/.env.deploy

# 🚀 デプロイスクリプト実行
echo "📡 EC2上でデプロイスクリプトを実行中..."
ssh -i $KEY_PATH $EC2_USER@$EC2_HOST "chmod +x $DEPLOY_SCRIPT_NAME && ./deploy.sh"