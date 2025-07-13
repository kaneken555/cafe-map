#!/bin/sh

echo "Waiting for database..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER"; do
  echo "Postgres is unavailable - waiting..."
  sleep 1
done

echo "Database started"

# マイグレーションを実行
if [ "$ENV" = "development" ]; then
  echo "Running makemigrations (development only)..."
  python manage.py makemigrations
fi
python manage.py migrate

# staticファイルを収集
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Gunicorn を起動
exec gunicorn config.wsgi:application --bind 0.0.0.0:8000 --timeout 120 --workers 3
