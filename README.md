# LINE LIFF + Auth.js + Supabase + App Router サンプルプロジェクト

このプロジェクトは、LINE LIFF を使用してユーザー認証を行い、Auth.js（NextAuth）でセッション管理し、Supabase（PostgreSQL）にユーザー情報を保存するサンプルアプリケーションです。Next.js 14 の App Router を使用しています。

> **注意**: このサンプルはローカル環境での動作確認のみ行っており、本番環境（Vercel 等）へのデプロイでの動作確認は行っていません。

## 参考資料

- [Supabase × LINE DC ローンチウィーク14 Meetup](https://www.youtube.com/watch?v=BdUBf4dnkMs&t=904s&ab_channel=LINEDeveloperCommunity)
- [LIFF認証で悩まないために 〜Auth.js × Supabase構成のリアル〜 スライド資料](https://speakerdeck.com/takeshi1998/liffren-zheng-denao-manaitameni-auth-dot-js-x-supabasegou-cheng-noriaru)

## 機能

- LINE LIFF による ID トークン取得
- Auth.js によるセッション管理
- Prisma ORM を使用した Supabase との連携
- Next.js App Router のサーバーコンポーネントでのユーザー情報取得
- ミドルウェアによる認証保護

## 使用技術

- [Next.js 14](https://nextjs.org/) (App Router)
- [LINE LIFF SDK](https://developers.line.biz/ja/docs/liff/)
- [Auth.js (NextAuth)](https://authjs.dev/)
- [Prisma](https://www.prisma.io/)
- [Supabase](https://supabase.io/) (PostgreSQL)
- [Tailwind CSS](https://tailwindcss.com/)

## セットアップ手順

### 1. リポジトリのクローン

```bash
git clone <リポジトリURL>
cd next-authjs-supabase-liff-starter
```

### 2. オールインワンセットアップ（推奨）

以下のコマンドを実行すると、依存パッケージのインストール、HTTPS 環境のセットアップ、Prisma クライアントの生成、Supabase の起動、データベースマイグレーションを一度に行うことができます：

```bash
# すべてのセットアップを一度に実行
pnpm run setup:all
```

### 3. 環境変数の設定

`.env.local`ファイルを編集して、LINE LIFF との接続に必要な環境変数を設定します：

```
# LINE LIFF
NEXT_PUBLIC_LIFF_ID="your-liff-id"
LINE_CHANNEL_ID="your-channel-id"
LINE_CHANNEL_SECRET="your-channel-secret"
```

### 4. 開発サーバーの起動

```bash
# 開発サーバーを起動（HTTPS対応）
pnpm dev
```

アプリケーションは`https://localhost:3000`で実行されます。

## 個別セットアップ手順（必要に応じて）

オールインワンセットアップがうまくいかない場合は、以下の手順を個別に実行してください。

### 依存パッケージのインストール

```bash
pnpm install
```

### mkcert のインストールとローカル環境の HTTPS 化

LIFF アプリケーションは HTTPS 環境が必要です。mkcert を使用してローカル開発環境を HTTPS 化します。

#### 自動セットアップスクリプトを使用する方法

```bash
# HTTPS環境のセットアップ
pnpm setup:https
```

#### 手動で mkcert をインストールする方法

macOS の場合:

```bash
# Homebrewを使用してmkcertをインストール
brew install mkcert
# ローカルCAをインストール
mkcert -install

# 証明書用のディレクトリを作成
mkdir -p certificates

# localhost用の証明書を生成
mkcert -key-file ./certificates/localhost-key.pem -cert-file ./certificates/localhost.pem localhost 127.0.0.1 ::1
```

### ローカル Supabase の起動

このプロジェクトでは、ローカルで Supabase を実行するために Supabase CLI を使用しています。

```bash
# Supabase CLIがインストールされていない場合
pnpm add -D supabase

# Supabaseのローカル環境を初期化（初回のみ）
npx supabase init

# Supabaseのローカル環境を起動
pnpm supabase:start
```

Supabase が正常に起動すると、以下のような情報が表示されます：

```
API URL: http://127.0.0.1:54321
GraphQL URL: http://127.0.0.1:54321/graphql/v1
DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
Studio URL: http://127.0.0.1:54323
```

### Prisma クライアントの生成とマイグレーション

```bash
# Prismaクライアントを生成
pnpm prisma generate

# データベースマイグレーションを実行
pnpm prisma migrate dev --name init
```

### Supabase Studio へのアクセス

ローカルの Supabase 管理画面（Studio）には以下の URL でアクセスできます：

```
http://127.0.0.1:54323
```

ここでデータベースのテーブルやデータを確認・編集できます。

## プロジェクト構成

- `prisma/`: Prisma スキーマとマイグレーションファイル
- `supabase/`: Supabase の設定ファイル
  - `config.toml`: Supabase の設定
- `certificates/`: mkcert で生成した HTTPS 証明書
- `src/app/`: Next.js の App Router 構造
  - `api/auth/[...nextauth]/`: Auth.js の API エンドポイント
  - `login/`: ログインページ
  - `protected/`: 認証保護されたページ
- `src/components/`: 共通コンポーネント
- `src/contexts/`: React コンテキスト（LIFF SDK 初期化など）
- `src/lib/`: ユーティリティ関数
  - `auth.ts`: Auth.js の設定
  - `prisma.ts`: Prisma クライアントのシングルトンインスタンス
- `src/middleware.ts`: 認証ミドルウェア
- `src/types/`: TypeScript 型定義

## アプリケーションのパス

このアプリケーションは以下の主要なパスで構成されています：

- `/`: ホームページ - 未認証でもアクセス可能。ログイン状態によって表示内容が変わります。
- `/login`: LIFF 認証ページ - LINE LIFF SDK を使用して認証を行い、ID トークンを取得します。認証済みの場合は `/protected` にリダイレクトされます。
- `/protected`: 保護されたページ - Auth.js による認証後のみアクセス可能。未認証の場合は `/login` にリダイレクトされます。ここではユーザー情報が表示されます。
- `/api/auth/[...nextauth]`: Auth.js の認証 API エンドポイント - 直接アクセスすることはありません。

ミドルウェア（`src/middleware.ts`）によって、認証状態に応じた適切なリダイレクトが行われます。

## 認証フロー

1. ユーザーが未認証状態で `/protected` にアクセス → `/login` にリダイレクト
2. `/login` ページで `liff.init()` → `liff.getIDToken()` → `signIn('liff')`
3. サーバーがトークンを検証・ユーザー情報を保存 → セッション確立
4. `/protected` に自動リダイレクト → `getServerSession()` 等で `user.lineId` や `user.name` を使用可能

### Cookieの確認方法

- ChromeのDevToolsを開き、左側のメニューから「Application」を選択します。
- 「Cookies」を選択し、対象のドメインをクリックします。
- `LIFF_STORE:expires:{NEXT_PUBLIC_LIFF_ID}`はLINE LIFFのトークンです。
- `__Secure-next-auth.session-token`はAuth.jsで発行したトークンです。

これらのCookieをDevTools上から削除することで、挙動確認が可能です。


### 証明書の警告について

ローカル開発環境で生成した証明書は自己署名証明書のため、ブラウザで警告が表示される場合があります。これは開発環境では問題ありません。警告を回避するには:

1. Chrome の場合: 警告画面で「詳細設定」→「〜にアクセスする（安全ではありません）」をクリック
2. Safari の場合: 「詳細」→「この Web サイトに進む」をクリック

## コントリビューション

このサンプルプロジェクトに関して誤りや改善点を見つけた場合は、プルリクエストを歓迎しています。また、本番環境での動作確認や機能追加なども大歓迎です。

## 質問・連絡先

質問や提案がある場合は、Twitter/X でお気軽にお問い合わせください：
[https://x.com/takeshi_sapiens](https://x.com/takeshi_sapiens)

## ライセンス

MIT
