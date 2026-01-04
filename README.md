# Tera System

Next.js + Hono + Drizzle ORM アーキテクチャテンプレート

## アーキテクチャ概要

- **UI層**: Next.js App Router
- **API層**: Hono (Web標準Request/Response)
- **Service層**: ビジネスロジック
- **Repository層**: Drizzle ORMによるデータアクセス
- **テスト**: Testcontainersを使用した実DBテスト

## ディレクトリ構造

```
├── app/                      # Next.js App Router
│   ├── api/[[...route]]/    # Hono API Route Handler
│   └── (pages)/             # UIページ
├── routes/                   # Controller層（オプション）
├── services/                 # ビジネスロジック
├── repositories/             # データアクセス層
├── db/                       # スキーマ & マイグレーション
├── lib/                      # ユーティリティ
├── __tests__/               # テスト
└── docker/                   # 開発用DB
```

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

```bash
cp .env.example .env
```

`.env`ファイルを編集:

```
DATABASE_URL=mysql://tera_user:tera_pass@localhost:3306/tera_db
NODE_ENV=development
```

### 3. MySQLコンテナの起動

```bash
npm run docker:up
```

### 4. スキーマの反映

```bash
npm run db:push
```

### 5. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアクセス可能

## 利用可能なコマンド

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動 |
| `npm run build` | プロダクションビルド |
| `npm run start` | プロダクションサーバー起動 |
| `npm run db:generate` | マイグレーションファイル生成 |
| `npm run db:migrate` | マイグレーション実行 |
| `npm run db:push` | スキーマ直接反映（開発用） |
| `npm run db:studio` | Drizzle Studio起動 |
| `npm run docker:up` | MySQLコンテナ起動 |
| `npm run docker:down` | MySQLコンテナ停止 |
| `npm run test` | テスト実行 |
| `npm run test:ui` | テストUI起動 |

## 開発フロー

### 機能追加の流れ

1. **スキーマ定義**: `db/schema.ts`
2. **Repository作成**: `repositories/`
3. **Service作成**: `services/`
4. **APIエンドポイント追加**: `app/api/[[...route]]/route.ts`
5. **テスト作成**: `__tests__/`

### マイグレーション

```bash
# スキーマを変更したらマイグレーションファイルを生成
npm run db:generate

# マイグレーションを実行
npm run db:migrate
```

## テスト

実DBを使用したテスト（mockなし）:

```bash
npm run test
```

Testcontainersが自動的にMySQLコンテナを起動してテストを実行します。

## APIエンドポイント

| Method | Endpoint | 説明 |
|--------|----------|------|
| POST | `/api/users` | ユーザー登録 |
| GET | `/api/users/:id` | ユーザー取得 |
| GET | `/api/health` | ヘルスチェック |

## 設計原則

- **責務分離**: 各レイヤーは明確な責務を持つ
- **型安全性**: TypeScript + Drizzle ORMで完全な型安全性
- **テスタビリティ**: Testcontainersによる信頼性の高いテスト
- **スケーラビリティ**: 小規模から大規模まで対応可能な構造

## ライセンス

MIT
