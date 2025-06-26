#!/bin/bash

# .env.deploy があれば読み込み
if [ -f .env.deploy ]; then
  source .env.deploy
fi

# 鍵の保存パス（環境変数優先、なければデフォルト）
GITHUB_KEY_PATH=${GITHUB_KEY_PATH:-~/.ssh/github_deploy_key}

# すでに存在する場合は確認
if [ -f "$GITHUB_KEY_PATH" ]; then
  echo "⚠️ GitHub用秘密鍵はすでに存在します: $GITHUB_KEY_PATH"
  read -p "🔁 上書きしますか？ (y/N): " yn
  case $yn in
    [Yy]* ) rm -f "$GITHUB_KEY_PATH" "$GITHUB_KEY_PATH.pub" ;;
    * ) echo "❌ 処理を中止しました"; exit 1 ;;
  esac
fi

# 鍵を生成（パスフレーズなし、ed25519）
echo "🔐 GitHub用秘密鍵を作成中..."
ssh-keygen -t ed25519 -f "$GITHUB_KEY_PATH" -N ""

echo ""
echo "✅ 秘密鍵生成完了: $GITHUB_KEY_PATH"
echo "📋 公開鍵を GitHub の Deploy Key に登録してください:"
echo "--------------------------------------------------"
cat "${GITHUB_KEY_PATH}.pub"
echo "--------------------------------------------------"
