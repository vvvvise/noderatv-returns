# Return of NODERA.TV

本プロジェクトは、[Yuji Nodera](https://github.com/yujinodera) 氏の歴史的プロダクトである **NODERA.TV** を2020年代の技術スタックでリプロダクトを試みる、オマージュプロジェクトです。

構成としては、 **turborepo + Yarn Berry** を使ったモノレポ構成です。  
フロントエンドとバックエンドをワークスペースとしてまとめ、低コスト運用で最大16名までのP2Pライブ配信を実現します。

---

## 概要

- **8x8分割で最大16コマのライブストリーム**をP2Pで配信  
- 画面右端に**リアルタイムチャット**を表示  
- **Twitter OAuth 2.0** で認証  
- **低コスト運用**を狙い、無料枠を活用  
- 同時接続数は **最大16名** に制限  

---

## アーキテクチャ

```plaintext
+------------------+
|   フロントエンド   |
+------------------+
| React.js + Vite  |
| WebRTC           |
| WebSocket        |
+------------------+
          |
          |
+-------------------+
|   バックエンド     |
+-------------------+
| Node.js (Fastify)|
| WebSocket Server |
| OAuth (Twitter)  |
| Signaling Server |
+-------------------+
          |
          |
+-------------------+
|   サーバインフラ    |
+-------------------+
| TURN (Coturn)     |
| Vercel / Fly.io   |
| Redis (オプション)  |
+-------------------+
```

- **フロントエンド**: `packages/frontend`
  - React.js / WebRTC / socket.io-client / Tailwind CSS
- **バックエンド**: `packages/backend`
  - Node.js / Fastify / socket.io / Passport.js / Coturn (TURNサーバ)

---

## ディレクトリ構成 (例)

```
.
├─ packages
│   ├─ frontend
│   │   ├─ src
│   │   ├─ package.json
│   │   └─ ...
│   └─ backend
│       ├─ src
│       ├─ package.json
│       └─ ...
├─ .gitignore
├─ package.json
├─ turbo.json
└─ README.md
```

---

## 使用技術 (抜粋)

### フロントエンド

1. **React.js**  
   Facebook製のUIライブラリ。コンポーネント単位でUIを設計し、大規模化にも強い。

2. **WebRTC API**  
   ブラウザ間のP2P通信を可能にし、低遅延で映像・音声をやり取りする。

3. **socket.io-client**  
   WebSocketをイベント駆動で扱いやすくするライブラリ。自動再接続などが強力。

4. **Tailwind CSS**  
   ユーティリティクラスベースのCSSフレームワーク。素早いUI構築をサポート。

### バックエンド

1. **Node.js + Fastify**  
   サーバサイドJavaScript環境。Fastifyは軽量＆高速なHTTPサーバフレームワーク。

2. **socket.io**  
   WebSocketでのリアルタイム通信を簡単に実装できるライブラリ。

3. **Passport.js (Twitter OAuth 2.0)**  
   多数のSNS・サービス連携に対応した認証ライブラリ。Twitter認証もシンプルに実装可能。

4. **Coturn**  
   WebRTCでNAT越えを行う際に必要なTURN/STUNサーバ。t2.micro程度で十分運用可能。

---

## セットアップ方法

1. **リポジトリをクローン**
   ```bash
   git clone https://github.com/your-organization/nodera-tv-monorepo.git
   cd nodera-tv-monorepo
   ```

2. **Yarn Berry を使って依存関係をインストール**
   ```bash
   yarn install
   ```

3. **開発用サーバを起動**  
   Turborepoの `dev` タスクにより、フロント/バックエンドが同時起動します。
   ```bash
   yarn dev
   ```
   - フロントエンド: http://localhost:3001 (例)
   - バックエンド: http://localhost:3000  (例)

4. **ビルド**
   ```bash
   yarn build
   ```

5. **デプロイ**  
   - フロントエンドをVercelにデプロイ  
   - バックエンドをFly.ioや任意の環境に配置  
   - TURNサーバ(Coturn)はAWS EC2で運用（t2.micro）など

---

## ライセンス
- TBD (会社やプロジェクト方針に応じて設定)

---

## 今後の予定
- 同時接続数のテストと負荷測定  
- Twitter以外のOAuth対応 (Google, GitHub等)  
- UIデザイン刷新 (Tailwind CSSのカスタマイズ強化)
