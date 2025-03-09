FROM python:3.10

WORKDIR /app

# 必要なパッケージをインストール
RUN apt-get update && apt-get install -y postgresql-client

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# エントリポイントスクリプトのコピーと実行権限付与
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# エントリポイントスクリプトを実行
ENTRYPOINT ["/entrypoint.sh"]
