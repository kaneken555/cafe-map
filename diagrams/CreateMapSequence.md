```mermaid
sequenceDiagram
    participant FE as フロントエンド (React)
    participant Browser as ブラウザ (Chrome/Firefox)
    participant BE as バックエンド (Django)
    participant DB as データベース (Django Models)

    FE->>BE: ① POST /api/maps/ (credentials: include)
    note right of Browser: ② sessionid クッキーを自動送信
    BE->>BE: ③ Djangoが sessionid を解析し request.user を設定
    BE->>DB: ④ request.user に基づいてマップ情報を保存
    DB-->>BE: ⑤ マップの保存完了（Map ID 付き）
    BE-->>FE: ⑥ 作成したマップ情報を返す (JSON)
