### 　
### 　

# 📺<br />_**N O D E R A .T V** ⌁ R e t u r n s ⌁_

> This is a tribute project that seeks to recreate the historic service NODERA.TV with a technology stack from the late 2020s.

<img src="https://github.com/user-attachments/assets/8562305e-b8b2-496c-a98c-e091ad93caef" width="200">

### 　
### 　

_**[Yuji Nodera](https://github.com/yujinodera)**_ 氏の歴史的プロダクト ⌁ _**NODERA.TV**_ ⌁<br /><br />
本プロジェクトは このロストテクノロジーの傑作を、2020年代後期の技術スタックでリプロダクトを行います。<br />
_**"そもそも可能性だけの世界だったインターネット"**_ を再現し _**"ゼロ地点から見た未来と、社会の仮想化が行き渡った現在"、"この二つの視点から観測可能となる社会の地層"**_<br />
これらを可視化しようとする試みです。

---

## OUTLINE

構成としては、 **turborepo + Yarn Berry** を使ったモノレポ構成となっています。  
フロントエンドとバックエンドをワークスペースPackageとして開発し、低コスト運用で最大16名までのP2Pライブ配信を実現する想定です。

- **4x4分割で最大16コマのライブストリーム**をP2Pで配信
- 画面右端に**リアルタイムチャット**を表示
- **Twitter OAuth 2.0** で認証
- **低コスト運用**を狙い、無料枠を活用
- 同時接続数は **最大16名** に制限
- 参考情報は [Wiki](https://github.com/vvvvise/return-of-noderatv/wiki) にまとめています、自由に追記してください
- 開発に関する機能追加要望などは [Issue](https://github.com/vvvvise/return-of-noderatv/issues) に新規issueを立てて下さい

---

## ARCHITECTURE

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
| Redis (Opyio)     |
+-------------------+
```

- **フロントエンド**: `packages/frontend`
  - React.js / WebRTC / socket.io-client / Tailwind CSS
- **バックエンド**: `packages/backend`
  - Node.js / Fastify / socket.io / Passport.js / Coturn (TURNサーバ)

---

## DIRECTIVES

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

## TECH-STACKS

### FRONTEND

1. **[React.js](https://ja.react.dev/)**  
   Facebook製のUIライブラリ

2. **[WebRTC API](https://webrtc.org/?hl=ja)**  
   ブラウザ間のP2P通信を可能にし、低遅延で映像・音声をやり取りする

3. **[socket.io-client](https://socket.io/docs/)**  
   WebSocketをイベント駆動で扱いやすくするライブラリ

### BACKEND

1. **Node.js + [Fastify](https://fastify.dev/)**  
   サーバサイドJavaScript環境。Fastifyは軽量＆高速なHTTPサーバフレームワーク

2. **[socket.io](https://socket.io/docs/)**  
   WebSocketでのリアルタイム通信を簡単に実装できるライブラリ

4. **[Passport.js](https://www.passportjs.org/) (Twitter OAuth 2.0)**  
   多数のSNS・サービス連携に対応した認証ライブラリ

5. **[Coturn](https://github.com/coturn/coturn)**  
   WebRTCでNAT越えを行う際に必要なTURN/STUNサーバ（t2.micro程度で十分運用可能と想定）

---

## SETUP

1. **リポジトリをクローン**

   ```bash
   git clone https://github.com/your-organization/nodera-tv-monorepo.git
   cd nodera-tv-monorepo
   ```

2. nodenvのインストール<br />
   https://github.com/nodenv/nodenv?tab=readme-ov-file#installation

   ```bash
   # nodenvのインストール後にshellを再起動
   $ exec $SHELL -l

   # installの確認
   $ nodenv -v
   nodenv 1.5.0
   ```

4. nodeのインストール
   ```bash
   $ nodenv install 20.18.0
   $ nodenv rehash
   $ node -v
   v20.18.0
   ```

2. **Yarn Berry で Workspaces を構築**

   ```bash
   $ sh ./scripts/setup.sh
   ```

3. **開発用サーバを起動**  
   Turborepoの `dev` タスクにより、フロント/バックエンドが同時起動します

   ```bash
   yarn dev
   ```

   - `.env` 導入してないのでとりあえず
   - フロントエンド: http://localhost:3001
   - バックエンド: http://localhost:3000

4. **ビルド**

   ```bash
   yarn build
   ```

5. **デプロイ（仮）**
   - フロントエンドをVercel（仮）にデプロイ
   - バックエンドをFly.io（仮）に配置
   - TURNサーバ(Coturn)はAWS EC2で運用（t2.micro）

---

## LICENSE

- TBD (未定)

---

## FUTUREPLANS

- 同時接続数のテストと負荷測定
- Twitter以外のOAuth対応 (Google, GitHub等)
- UIデザイン刷新
- etc... [Issues](https://github.com/vvvvise/return-of-noderatv/issues)　へ
