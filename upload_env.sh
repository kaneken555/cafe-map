#!/bin/bash
set -e  # エラーで停止

# 📂 EC2上にディレクトリがなければ作成
echo "📁 secretsディレクトリを作成中（必要であれば）..."
ssh private-ec2 'mkdir -p /home/ec2-user/secrets'

# 📤 EC2 に転送
echo "📤 EC2に転送中..."
scp .env.deploy private-ec2:/home/ec2-user/secrets