// PeerConnectionManager.ts
let peerConnection: RTCPeerConnection | null = null;

const PeerConnectionManager = {
  init: (localVideo: HTMLVideoElement, remoteVideo: HTMLVideoElement) => {
    peerConnection = new RTCPeerConnection();

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        localVideo.srcObject = stream;
        stream.getTracks().forEach((track) => {
          peerConnection?.addTrack(track, stream);
        });
      });

    peerConnection.ontrack = (event) => {
      remoteVideo.srcObject = event.streams[0];
    };

    // 本来はシグナリングサーバと通信して offer/answer, ICE candidate をやり取りする
    // ここでは省略
  },
};

export default PeerConnectionManager;
