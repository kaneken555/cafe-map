#!/bin/sh
# 環境変数からnginx.confを生成
envsubst '$NGINX_SERVER_NAME' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# nginx起動
exec nginx -g "daemon off;"
