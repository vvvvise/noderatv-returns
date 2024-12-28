import React, { useEffect, useRef } from 'react';
import PeerConnectionManager from './PeerConnectionManager';

const VideoGrid: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // 簡易サンプル: PeerConnectionManager側でP2P初期化
    PeerConnectionManager.init(localVideoRef.current!, remoteVideoRef.current!);
  }, []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      <video ref={localVideoRef} autoPlay muted style={{ width: '200px' }} />
      <video ref={remoteVideoRef} autoPlay style={{ width: '200px' }} />
      {/* 8x8分割を想定するなら動画要素を動的に増やす or フレックスで拡張 */}
    </div>
  );
};

export default VideoGrid;
