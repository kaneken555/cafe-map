#!/bin/bash
set -e  # エラーで停止

# ====== .env ファイルの読み込み ======
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ .env ファイルが見つかりません: $ENV_FILE"
  exit 1
fi

# .env 読み込み
export $(grep -v '^#' "$ENV_FILE" | xargs)

# ====== 必須変数の確認 ======
if [ -z "$BASTION_SG_ID" ] || [ -z "$REGION" ] || [ -z "$PORT" ]; then
  echo "❌ SG_ID, REGION, PORT は .env に必須です"
  exit 1
fi

# ====== グローバルIP取得 ======
CURRENT_IP=$(curl -s https://checkip.amazonaws.com)
CIDR="${CURRENT_IP}/32"
echo "📡 現在のIP: $CIDR"

# ====== 既存のルール確認 ======
echo "🔍 現在の許可リストを確認中..."
EXISTING_IPS=$(aws ec2 describe-security-groups \
  --group-ids "$BASTION_SG_ID" \
  --region "$REGION" \
  --query "SecurityGroups[0].IpPermissions[?FromPort==\`$PORT\` && ToPort==\`$PORT\`].IpRanges[*].CidrIp" \
  --output text \
  --profile "$PROFILE_NAME")

# ====== 古いIPの削除 ======
for OLD_CIDR in $EXISTING_IPS; do
  if [ "$OLD_CIDR" != "$CIDR" ]; then
    echo "🗑 古いIPルール削除: $OLD_CIDR"
    aws ec2 revoke-security-group-ingress \
      --group-id "$BASTION_SG_ID" \
      --protocol tcp \
      --port "$PORT" \
      --cidr "$OLD_CIDR" \
      --region "$REGION" \
      --profile "$PROFILE_NAME"
  fi
done

# ====== 新しいIPを許可 ======
echo "✅ 新しいIPルール追加: $CIDR"
aws ec2 authorize-security-group-ingress \
  --group-id "$BASTION_SG_ID" \
  --protocol tcp \
  --port "$PORT" \
  --cidr "$CIDR" \
  --region "$REGION" \
  --profile "$PROFILE_NAME"

echo "🎉 セキュリティグループの更新が完了しました"
