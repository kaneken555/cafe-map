# ================================
# Django × Docker 用 Makefile（共有用）
# repo: cafe-map
# ================================

# ============ 基本設定 ============
PROJECT_NAME     ?= cafe-map-dev
COMPOSE_FILE     ?= docker-compose.dev.yml

WEB_SERVICE      ?= backend      # Django
DB_SERVICE       ?= db           # PostgreSQL
NGINX_SERVICE    ?= nginx
SHELL            ?= bash

WEB_PORT         ?= 8000         # 直接Djangoを見る場合
NGINX_PORT       ?= 80           # 逆プロキシ経由

MANAGE_PY        ?= python manage.py
DJANGO_MAKEMIG   ?= $(MANAGE_PY) makemigrations
DJANGO_MIGRATE   ?= $(MANAGE_PY) migrate
DJANGO_SU        ?= $(MANAGE_PY) createsuperuser
DJANGO_COLLECT   ?= $(MANAGE_PY) collectstatic --noinput
DJANGO_TEST      ?= pytest -q
DJANGO_SHELL     ?= $(MANAGE_PY) shell

PY_LINT_CMD      ?= ruff check . && black --check . && isort --check-only .
PY_FMT_CMD       ?= ruff check . --fix && black . && isort .

DC := docker compose -p $(PROJECT_NAME) -f $(COMPOSE_FILE)

# 個人上書き（あれば読み込む）
-include Makefile.local

# ============ ヘルプ ============
.PHONY: help
help:
	@echo "Make targets for $(PROJECT_NAME) (compose: $(COMPOSE_FILE))"
	@awk 'BEGIN {FS":.*##"; printf "\n  %-20s %s\n", "Target", "Description"; \
	             printf "  %-20s %s\n", "------", "-----------"} \
	     /^[a-zA-Z0-9_\-\.%]+:.*##/ {printf "  %-20s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

# ============ ライフサイクル ============
.PHONY: up
up: ## ビルドして起動（-d）
	$(DC) up -d --build

.PHONY: down
down: ## 停止（ボリューム維持）
	$(DC) down

.PHONY: clean
clean: ## 停止＋ボリューム/孤児削除（初期化）
	$(DC) down -v --remove-orphans

.PHONY: restart
restart: ## 再起動（差分ビルド）
	$(DC) up -d --build

.PHONY: ps
ps: ## 稼働状況
	$(DC) ps

# ============ ログ / シェル ============
.PHONY: logs
logs: ## 全サービスのログ追従
	$(DC) logs -f --tail=200

.PHONY: logs-web
logs-web: ## Djangoのログ
	$(DC) logs -f $(WEB_SERVICE)

.PHONY: logs-db
logs-db: ## Postgresのログ
	$(DC) logs -f $(DB_SERVICE)

.PHONY: logs-nginx
logs-nginx: ## Nginxのログ
	$(DC) logs -f $(NGINX_SERVICE)

.PHONY: sh
sh: ## Djangoコンテナに入る
	$(DC) exec $(WEB_SERVICE) $(SHELL)

.PHONY: sh-db
sh-db: ## DBコンテナに入る
	$(DC) exec $(DB_SERVICE) sh

# ============ DB / マイグレーション ============
.PHONY: makemigrations
makemigrations: ## makemigrations
	$(DC) exec $(WEB_SERVICE) bash -lc '$(DJANGO_MAKEMIG)'

.PHONY: migrate
migrate: ## migrate
	$(DC) exec $(WEB_SERVICE) bash -lc '$(DJANGO_MIGRATE)'

.PHONY: seed
seed: ## fixtures投入（あれば）
	$(DC) exec $(WEB_SERVICE) bash -lc '$(MANAGE_PY) loaddata dev_fixture.json || true'

.PHONY: reset-db
reset-db: ## DB初期化（開発専用・データ消えます）
	@echo "Resetting DB volumes (dev only)"
	$(DC) down -v
	$(DC) up -d --build
	$(DC) exec $(WEB_SERVICE) bash -lc '$(DJANGO_MIGRATE) && $(MANAGE_PY) loaddata dev_fixture.json || true'

# ============ 静的ファイル ============
.PHONY: collectstatic
collectstatic: ## staticfiles 収集（Nginxで配信する場合）
	$(DC) exec $(WEB_SERVICE) bash -lc '$(DJANGO_COLLECT)'

# ============ 管理系 ============
.PHONY: createsuperuser
createsuperuser: ## 管理ユーザー作成（対話式）
	$(DC) exec $(WEB_SERVICE) bash -lc '$(DJANGO_SU)'

.PHONY: shell
shell: ## Django shell
	$(DC) exec $(WEB_SERVICE) bash -lc '$(DJANGO_SHELL)'

# ============ テスト / 品質 ============
.PHONY: test
test: ## pytest 実行
	$(DC) exec $(WEB_SERVICE) bash -lc '$(DJANGO_TEST)'

.PHONY: lint
lint: ## Lint（ruff/black/isort）
	$(DC) exec $(WEB_SERVICE) bash -lc '$(PY_LINT_CMD)'

.PHONY: fmt
fmt: ## 自動整形（ruff--fix/black/isort）
	$(DC) exec $(WEB_SERVICE) bash -lc '$(PY_FMT_CMD)'

# ============ 依存関係 ============
.PHONY: deps
deps: ## requirements.txt をインストール
	$(DC) exec $(WEB_SERVICE) bash -lc '\
		if [ -f requirements.txt ]; then pip install -r requirements.txt; \
		else echo "requirements.txt が見つかりません"; fi'

# ============ ブラウザ起動 ============
.PHONY: open
open: ## ブラウザで開く（macOS向け）
	@open http://localhost:$(NGINX_PORT) || true
	@open http://localhost:$(WEB_PORT) || true
