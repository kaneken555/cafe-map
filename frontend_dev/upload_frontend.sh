#!/bin/bash

# .env.deploy が存在すれば読み込む
if [ -f .env.deploy ]; then
  source .env.deploy
else
  echo "❌ .env.deploy が見つかりません"
  exit 1
fi

# 以降は変数を使って操作
npm run build

aws s3 sync dist s3://$BUCKET_NAME --delete --profile $PROFILE_NAME

echo "✅ フロントエンドをS3にアップロードしました"