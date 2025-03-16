#!/bin/sh

echo "Waiting for database..."
until pg_isready -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER"; do
  echo "Postgres is unavailable - waiting..."
  sleep 1
done

echo "Database started"

# マイグレーションを実行
python manage.py makemigrations
python manage.py migrate

# Gunicorn を起動
exec gunicorn config.wsgi:application --bind 0.0.0.0:8000 --timeout 120 --workers 3
