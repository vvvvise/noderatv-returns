import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import PeerConnectionManager from '../modules/PeerConnectionManager';

const WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL || '';
const MAX_VIDEOS = 16;

interface RemoteStreamCallback {
  (stream: MediaStream): void;
}

export function useVideoGrid() {
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map<string, MediaStream>());
  const socketRef = useRef<Socket | null>(null);
  const isConnectedRef = useRef(false);

  // ローカル映像をセットするためのref（UI側がアクセスする）
  const localVideoRef = useRef<HTMLVideoElement>(null);

  // リモートストリームを追加するコールバック
  const onRemoteStreamAdded = useCallback<RemoteStreamCallback>((stream) => {
    setRemoteStreams((prevStreams) => {
      if (!prevStreams.has(stream.id) && prevStreams.size < MAX_VIDEOS) {
        const newStreams = new Map(prevStreams);
        newStreams.set(stream.id, stream);
        return newStreams;
      }
      return prevStreams;
    });
  }, []);

  // WebSocket接続＆PeerConnection初期化
  useEffect(() => {
    const ws = io(WEBSOCKET_URL);
    const onRemoteStream = onRemoteStreamAdded as unknown as HTMLVideoElement;
    socketRef.current = ws;

    ws.on('connect', () => {
      isConnectedRef.current = true;
      if (localVideoRef.current) {
        PeerConnectionManager.init(localVideoRef.current, onRemoteStream, ws);
      }
    });

    ws.on('disconnect', () => {
      isConnectedRef.current = false;
    });

    // Cleanup
    return () => {
      isConnectedRef.current = false;
      PeerConnectionManager.closeConnection();
      ws.close();
    };
  }, [onRemoteStreamAdded]);

  // Offer作成処理
  const handleCreateOffer = useCallback(() => {
    if (!socketRef.current) {
      console.error('No socket reference');
      return;
    }
    if (!isConnectedRef.current) {
      console.error('Cannot create offer: not connected');
      return;
    }

    try {
      PeerConnectionManager.createOffer(socketRef.current as unknown as Socket);
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }, []);

  return {
    remoteStreams,
    localVideoRef,
    isConnectedRef,
    handleCreateOffer
  };
}
