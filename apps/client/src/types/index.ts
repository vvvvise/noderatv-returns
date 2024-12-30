export { };

declare global {

  export interface VideoGridProps {
    className?: string;
  }

  export interface VideoElementProps {
    stream: MediaStream;
    isLocal?: boolean;
  }

  export interface WebSocketState {
    isConnected: boolean;
    error: Error | null;
  }

  export interface StreamsState {
    localStream: MediaStream | null;
    remoteStreams: Map<string, MediaStream>;
  }

  export interface PeerConnectionManagerState {
    peerConnection: RTCPeerConnection | null;
    dataChannel: RTCDataChannel | null;
  }

  export interface UseVideoGridReturn {
    videoGridProps: VideoGridProps;
    videoElementProps: VideoElementProps;
    webSocketState: WebSocketState;
    streamsState: StreamsState;
    peerConnectionManagerState: PeerConnectionManagerState;
    handleCreateOffer: () => void;
  }

  export interface ImportMeta {
    url: string;
    main: boolean;
    env: Record<string, string>;
  }

}