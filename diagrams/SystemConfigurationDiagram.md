```mermaid
graph TD;
  subgraph User
    A[User] -->|アクセス| B[Frontend<br>React, TypeScript]
  end

  subgraph AWS
    B -->|リクエスト| N[Nginx<br>on EC2]
    N -->|リバースプロキシ| C[Backend<br>Django on EC2]
    C -->|データ取得| D[PostgreSQL<br>on RDS]
  end

  subgraph Infrastructure
    G[Docker] -->|コンテナ化| C
    H[EC2] -->|ホスティング| N & C
    N -->|静的ファイル配信| B
    C -->|データベース接続| D
    I[RDS<br>PostgreSQL] -->|DB管理| D
  end

  subgraph CI/CD
    F[GitHub Actions] -->|デプロイ| H
  end

  C -->|APIリクエスト| E[Google Maps API]
