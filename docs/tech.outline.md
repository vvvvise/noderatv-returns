# 帰ってきたNODERA.TV : Tech Document

## **OUTLINE**
- 8x8分割で最大16コマのライブストリームをP2Pで配信  
- 画面右端にチャットを表示  
- 認証はTwitter OAuth 2.0を利用  
- サーバリソースは最小化し、可能な限り低コストで運用  
- 同時接続数は最大16名に制限  

---

## **1. システムアーキテクチャ**

### **全体構成図**
```plaintext
+------------------+
|   フロントエンド |
+------------------+
| React.js + Vite |
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
|   サーバインフラ   |
+-------------------+
| TURN (Coturn)    |
| Vercel / Fly.io  |
| Redis (オプション)|
+-------------------+
```

---

## **2. 詳細設計**

### **フロントエンド**

#### **使用技術**

1. **React.js**  
   - **説明**: Facebook（Meta）が開発したUIライブラリ。コンポーネント指向で大規模アプリケーションの開発を効率化する。  
   - **サンプルコード（超簡易）**:
     ```jsx
     // App.jsx
     import React from 'react';

     function App() {
       return (
         <div>
           <h1>Hello from React!</h1>
         </div>
       );
     }

     export default App;
     ```

2. **WebRTC API**  
   - **説明**: ブラウザ間で音声や映像、データを直接やり取りできる仕組み。P2P通信を可能にし、中央サーバを介さずに低遅延なストリームを実現する。  
   - **サンプルコード（超簡易）**:
     ```js
     // webrtcSample.js
     const localVideo = document.getElementById('localVideo');
     const remoteVideo = document.getElementById('remoteVideo');
     const peerConnection = new RTCPeerConnection();

     // カメラ映像の取得
     navigator.mediaDevices.getUserMedia({ video: true, audio: true })
       .then(stream => {
         localVideo.srcObject = stream;
         stream.getTracks().forEach(track => {
           peerConnection.addTrack(track, stream);
         });
       });

     // SDP offer/answerの交換はシグナリングサーバで管理して行う
     // ここでは簡易化
     peerConnection.ontrack = (event) => {
       remoteVideo.srcObject = event.streams[0];
     };
     ```

3. **socket.io-client**  
   - **説明**: WebSocketをより扱いやすくするライブラリ。自動再接続やイベントベース通信をサポート。  
   - **サンプルコード（フロント側）**:
     ```js
     // chatClient.js
     import io from 'socket.io-client';

     const socket = io('http://localhost:3000');

     socket.on('connect', () => {
       console.log('Connected to server');
     });

     socket.on('chatMessage', (msg) => {
       console.log('Received chat:', msg);
     });

     // 送信例
     function sendChatMessage(message) {
       socket.emit('chatMessage', message);
     }
     ```

4. **Tailwind CSS**  
   - **説明**: ユーティリティクラスベースのCSSフレームワーク。自由度が高く、素早いUIデザインが可能。  
   - **サンプルHTML**:
     ```html
     <!-- index.html -->
     <div class="bg-blue-500 text-white p-4 m-2 rounded">
       Tailwind Sample Box
     </div>
     ```

#### **機能概要**
1. **ライブストリーム管理**:
   - 各ユーザーが最大15人とP2P接続  
   - 8x8分割レイアウトで映像を動的に割り当て

2. **チャット表示**:
   - WebSocketを使用したリアルタイム通信  
   - メッセージにTwitterのユーザー名とアイコンを表示

3. **認証フロー**:
   - Twitter OAuthで認証  
   - アクセストークンを利用してセッションを管理

#### **主要コンポーネント**
| コンポーネント          | 説明                                      |
|-------------------------|------------------------------------------|
| `VideoGrid`             | 8x8分割レイアウトで映像を表示            |
| `ChatBox`               | 画面右端にリアルタイムチャットを表示      |
| `AuthHandler`           | Twitter認証を処理                        |
| `PeerConnectionManager` | WebRTC接続（Offer/AnswerやICE管理）を一括 |

---

### **バックエンド**

#### **使用技術**

1. **Node.js + Fastify**  
   - **説明**: Node.jsはサーバサイドJavaScript実行環境。Fastifyは軽量かつ高速なHTTPサーバフレームワーク。  
   - **サンプルコード（超簡易）**:
     ```js
     // server.js
     const fastify = require('fastify')();

     fastify.get('/', async () => {
       return { hello: 'world' };
     });

     fastify.listen({ port: 3000 }, (err) => {
       if (err) throw err;
       console.log('Server running on port 3000');
     });
     ```

2. **socket.io**  
   - **説明**: WebSocketを扱いやすくするためのライブラリ（サーバ側）。  
   - **サンプルコード（サーバ側）**:
     ```js
     // chatServer.js
     const fastify = require('fastify')();
     const io = require('socket.io')(fastify.server, {
       cors: { origin: '*' }
     });

     io.on('connection', (socket) => {
       console.log('a user connected');

       socket.on('chatMessage', (msg) => {
         console.log('Received:', msg);
         // 全員にブロードキャスト
         io.emit('chatMessage', msg);
       });
     });

     fastify.listen({ port:3000 }, (err) => {
       if (err) throw err;
       console.log('WebSocket server listening on port 3000');
     });
     ```

3. **Passport.js (Twitter OAuth 2.0)**  
   - **説明**: Node.js向け認証ライブラリ。多数のSNSやサービスと連携できる。  
   - **サンプルコード（Twitter戦略）**:
     ```js
     const passport = require('passport');
     const TwitterStrategy = require('passport-twitter').Strategy;

     passport.use(new TwitterStrategy({
       consumerKey: 'YOUR_CONSUMER_KEY',
       consumerSecret: 'YOUR_CONSUMER_SECRET',
       callbackURL: 'http://localhost:3000/auth/twitter/callback'
     },
     (token, tokenSecret, profile, done) => {
       // DBにユーザー情報を保存するなど
       return done(null, profile);
     }));
     ```

4. **Coturn**  
   - **説明**: WebRTCで外部ネットワーク同士をP2P接続する際に必要なTURN/STUNサーバ。NAT越えを助ける。  
   - **サンプル設定抜粋**: `turnserver.conf`  
     ```bash
     listening-port=3478
     realm=example.com
     # 認証用IDとパスワードを設定
     user=username:password
     ```

#### **機能概要**
1. **Signalingサーバ**:
   - WebRTC接続の初期化  
   - P2P接続を仲介（SDPとICE候補の交換）

2. **チャットサーバ**:
   - クライアント間のメッセージ中継  
   - 同時接続16名までをサポート

3. **認証サーバ**:
   - Twitter OAuth 2.0でユーザー認証  
   - トークンを発行してセッション管理

#### **主要API設計**
| HTTPメソッド | エンドポイント             | 機能                                  |
|--------------|---------------------------|---------------------------------------|
| GET          | `/auth/twitter`          | Twitter認証を開始                     |
| GET          | `/auth/twitter/callback` | 認証コールバック処理                  |
| POST         | `/signal`                | WebRTC Signalingデータを中継          |
| POST         | `/chat`                  | チャットメッセージをサーバに送信      |

#### **サーバ構成**
- **Signalingサーバ**: WebRTCのSDP/ICE交換  
- **チャットサーバ**: socket.ioによるメッセージ中継  
- **認証サーバ**: OAuth認証フローを担当

---

## **3. デプロイ環境**

### **ホスティングサービス**
1. **フロントエンド**:
   - **Vercel**  
     - **説明**: サーバレス環境を提供するホスティングサービス。Reactなどの静的サイトを簡単にデプロイできる。  
     - **デプロイ例**:  
       ```
       vercel --prod
       ```
2. **バックエンド**:
   - **Fly.io**  
     - **説明**: コンテナをグローバルにホストできるPaaS。無料枠あり。  
     - **デプロイ例 (Dockerfileベース)**:  
       ```bash
       flyctl launch
       flyctl deploy
       ```
3. **TURNサーバ**:
   - **Coturn (AWS EC2)**  
     - **説明**: t2.micro無料枠のEC2インスタンス上でCoturnを起動。  
     - **導入例**:
       ```bash
       sudo apt-get update
       sudo apt-get install coturn
       sudo vi /etc/turnserver.conf
       # 設定編集後に
       sudo service coturn restart
       ```

### **構成のポイント**
- 無料枠や軽量ホスティングをフル活用し、コスト最小化  
- TURNサーバはNAT越えを助けるだけで、大規模トラフィックがなければt2.microでも十分

---

## **4. セキュリティ設計**

### **認証セキュリティ**
- OAuthトークンはHTTPS経由でやり取りし、漏洩リスクを低減  
- セッション有効期限を短めに設定（例: 1時間）し、長期利用を防止

### **通信セキュリティ**
- WebRTCはデフォルトでSRTP（Secure RTP）を使うため、映像・音声は暗号化  
- socket.ioの通信もTLSで暗号化（WSS）

### **DDoS対策**
- **Rate Limiting**: 1ユーザーあたりのリクエスト回数制限  
- **WAF**: Cloudflareなどのサービスで不審なアクセスをブロック

---

## **5. 開発フローと運用計画**

### **開発フロー**
1. **プロトタイプ開発**  
   - WebRTC接続とSignalingの実装  
   - 8x8分割UIのベース構築
2. **機能統合**  
   - socket.ioを使ったチャット機能の追加  
   - Twitter OAuth認証機能の追加
3. **負荷テスト**  
   - 同時接続16名を想定し、P2P接続・チャットの同時通信を検証
4. **本番環境デプロイ**  
   - フロントエンドはVercel、バックエンドはFly.io、TURNサーバはAWS EC2

### **運用計画**
- **モニタリング**  
  - TURNサーバ: Grafana + Prometheusなどでリソース状況を監視  
  - Vercel/Fly.io: 各種ビルトインのモニター機能で稼働状況を確認
- **ログ管理**  
  - チャット履歴の保管はRedisや外部DBに一時保存（必要に応じて期間限定で保存）

---

## **6. コスト試算**

| サービス         | 使用プラン             | 月額コスト                      |
|------------------|------------------------|---------------------------------|
| **Vercel**       | 無料プラン            | $0                               |
| **Fly.io**       | 無料枠利用            | $0                               |
| **AWS EC2**      | t2.micro（無料枠）     | $0（初年度無料枠内）             |
| **Redis**        | Elasticache（オプション） | $10〜（必要時のみ）              |
| **ドメイン**     | 独自ドメイン          | $12/年（Namecheapなど）         |

- **合計コスト（初年度）**: $0〜$12/月 程度  
  （主に独自ドメイン費用が発生する程度）
