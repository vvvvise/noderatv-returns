import { Socket } from 'socket.io-client';

let peerConnection: RTCPeerConnection | null = null;
let localStream: MediaStream | null = null;

/**
 * WebRTCのP2P接続を管理するオブジェクト
 */
const PeerConnectionManager = {
  /**
   * 初期化処理
   * @param localVideo  - 自分の映像を表示するHTMLVideoElement
   * @param remoteVideo - 相手の映像を表示するHTMLVideoElement
   * @param socket      - シグナリング用のSocket(io)
   */
  init: async (
    localVideo: HTMLVideoElement,
    remoteVideo: HTMLVideoElement,
    socket: typeof Socket
  ) => {
    // 1. RTCPeerConnectionの作成
    peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        // TURNサーバも必要なら、ここに設定
        // { urls: 'turn:your.turn.server', username: 'xxx', credential: 'xxx' },
      ],
    });

    // 2. ローカル映像／音声の取得
    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideo.srcObject = localStream;

      // 取得したトラックをすべてPeerConnectionに追加
      localStream.getTracks().forEach((track) => {
        peerConnection?.addTrack(track, localStream!);
      });
    } catch (err) {
      console.error('Failed to get local stream', err);
      return;
    }

    // 3. リモートトラックが追加された時に呼ばれる
    peerConnection.ontrack = (event) => {
      console.log('Received remote track', event.streams);
      if (event.streams && event.streams[0]) {
        remoteVideo.srcObject = event.streams[0];
      }
    };

    // 4. ICE candidate を取得したときに呼ばれる
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Sending ICE candidate to server', event.candidate);
        // シグナリングサーバにcandidateを送信
        socket.emit('candidate', event.candidate);
      }
    };

    // 5. シグナリングメッセージの受信ハンドラを設定（socket.io）
    //    - offer/answer, candidateを受け取ったら処理を行う
    socket.on('offer', async (offer: RTCSessionDescriptionInit) => {
      console.log('Received offer:', offer);
      if (!peerConnection) return;

      // 5-1. 相手からのOfferをsetRemoteDescription
      await peerConnection.setRemoteDescription(offer);

      // 5-2. Answerを作成＆送信
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      console.log('Sending answer to server:', answer);
      socket.emit('answer', answer);
    });

    socket.on('answer', async (answer: RTCSessionDescriptionInit) => {
      console.log('Received answer:', answer);
      if (!peerConnection) return;

      // 5-3. 相手からのAnswerをsetRemoteDescription
      await peerConnection.setRemoteDescription(answer);
    });

    socket.on('candidate', async (candidate: RTCIceCandidateInit) => {
      console.log('Received candidate:', candidate);
      if (!peerConnection) return;

      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error('Error adding received ice candidate', err);
      }
    });
  },

  /**
   * 自分からOfferを作成し、シグナリングサーバに送信する
   * 通常は「ルームマスター」的な役割をする側が呼び出す想定
   * @param socket - シグナリング用のSocket(io)
   */
  createOffer: async (socket: typeof Socket) => {
    if (!peerConnection) return;

    try {
      // 1. Offerの作成
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // 2. Offerをシグナリングサーバに送信
      console.log('Sending offer to server:', offer);
      socket.emit('offer', offer);
    } catch (err) {
      console.error('Failed to create offer', err);
    }
  },

  /**
   * 明示的に切断する場合に呼び出すクリーンアップ関数
   */
  closeConnection: () => {
    if (peerConnection) {
      peerConnection.ontrack = null;
      peerConnection.onicecandidate = null;
      peerConnection.close();
      peerConnection = null;
    }
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
      localStream = null;
    }
  },
};

export default PeerConnectionManager;
