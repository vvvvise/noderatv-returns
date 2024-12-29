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
