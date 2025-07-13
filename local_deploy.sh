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

# 📤 デプロイスクリプトをEC2に送信（踏み台経由）
echo "📤 デプロイスクリプトをEC2に送信中..."
# scp -i "$EC2_KEY_PATH" -o ProxyJump="$BASTION_USER@$BASTION_HOST" \
#   "$DEPLOY_SCRIPT_NAME" "$EC2_USER@$EC2_HOST:/home/$EC2_USER/"
scp "$DEPLOY_SCRIPT_NAME" private-ec2:/home/ec2-user/


# 📤 .env.deploy をEC2に送信（踏み台経由）
echo "📤 .env をEC2に転送中..."
# scp -i "$EC2_KEY_PATH" -o ProxyJump="$BASTION_USER@$BASTION_HOST" \
#   .env.deploy "$EC2_USER@$EC2_HOST:/home/$EC2_USER/.env.deploy"
scp .env.deploy private-ec2:/home/ec2-user/.env.deploy


# 🚀 デプロイスクリプト実行（踏み台経由）
echo "📡 EC2上でデプロイスクリプトを実行中..."
# ssh -i "$EC2_KEY_PATH" -J "$BASTION_USER@$BASTION_HOST" \
#   "$EC2_USER@$EC2_HOST" "chmod +x $DEPLOY_SCRIPT_NAME && ./deploy.sh"
ssh private-ec2 "chmod +x $DEPLOY_SCRIPT_NAME && ./deploy.sh"
