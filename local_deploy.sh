#!/bin/bash

echo "📤 デプロイスクリプトをEC2に送信中..."
scp -i $KEY_PATH $SCRIPT_NAME $EC2_USER@$EC2_HOST:/home/$EC2_USER/

echo "📤 .env をEC2に転送中..."
scp -i $KEY_PATH .env $EC2_USER@$EC2_HOST:$REMOTE_DIR/

echo "📡 EC2上でデプロイスクリプトを実行中..."
ssh -i $KEY_PATH $EC2_USER@$EC2_HOST "chmod +x $SCRIPT_NAME && ./deploy.sh"