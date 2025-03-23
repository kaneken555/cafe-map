```mermaid
sequenceDiagram
    participant FE as フロントエンド (React)
    participant Browser as ブラウザ (Chrome/Firefox)
    participant BE as バックエンド (Django)
    participant DB as データベース (Django Models)

    FE->>BE: ① POST /api/guest-login/
    BE->>DB: ② ゲストユーザーを作成 (User Model)
    DB-->>BE: ③ 新しいゲストユーザーを返す
    BE->>Browser: ④ sessionid クッキーを発行 (Set-Cookie)
    FE->>BE: ⑤ GET /api/current-user/ (credentials: include)
    note right of Browser: ⑥ sessionid クッキーを自動送信
    BE->>BE: ⑦ Djangoが sessionid を解析し request.user を設定
    BE-->>FE: ⑧ ログイン中のユーザー情報を返す (JSON)
