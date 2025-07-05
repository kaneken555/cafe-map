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
echo "📦 Docker / Git / CloudWatch Agent インストール中..."
sudo yum install -y docker git libxcrypt-compat amazon-cloudwatch-agent

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

echo "📝 CloudWatch Agent 設定ファイルを作成中..."
sudo mkdir -p /opt/aws/amazon-cloudwatch-agent/etc

sudo tee /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json > /dev/null << 'EOCONF'
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/home/ec2-user/myapp/cafe-map/logs/nginx/access.log",
            "log_group_name": "nginx-access-log",
            "log_stream_name": "{instance_id}-access"
          },
          {
            "file_path": "/home/ec2-user/myapp/cafe-map/logs/nginx/error.log",
            "log_group_name": "nginx-error-log",
            "log_stream_name": "{instance_id}-error"
          },
          {
            "file_path": "/home/ec2-user/myapp/cafe-map/logs/django/info.log",
            "log_group_name": "django-info-log",
            "log_stream_name": "{instance_id}-django-info"
          },
          {
            "file_path": "/home/ec2-user/myapp/cafe-map/logs/django/error.log",
            "log_group_name": "django-error-log",
            "log_stream_name": "{instance_id}-django-error"
          }
        ]
      }
    }
  }
}
EOCONF

echo "🚀 CloudWatch Agent を起動中..."
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config -m ec2 \
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json -s

echo "✅ CloudWatch Agent の設定と起動が完了しました"
EOF

echo "✅ EC2へのDocker / Git / CloudWatch Agent セットアップが完了しました"
echo "🚨 注意: グループ追加の反映にはログアウト・再ログインが必要です"
