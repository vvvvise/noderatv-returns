import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_APP_SOCKET_URL || 'http://localhost:3000';

export interface UseChatBoxReturn {
  messages: string[];
  inputValue: string;
  handleInputChange: (value: string) => void;
  handleSendMessage: () => void;
}

/**
 * ChatBoxコンポーネントのロジック（カスタムフック）
 * - Socket.io による接続
 * - メッセージ履歴管理
 * - 入力フォーム管理
 */
export function useChatBox(): UseChatBoxReturn {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  // Socketはコンポーネント外でもいいが、ここでは例として関数スコープ内で管理
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // サーバに接続
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('connect', () => {
      console.log('Connected to chat server');
    });

    // 'chatMessage'イベント受信 → messagesに追加
    socketRef.current.on('chatMessage', (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    // cleanup
    return () => {
      console.log('Disconnecting socket...');
      socketRef.current?.disconnect();
    };
  }, []);

  // テキスト入力変更時
  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, [setInputValue]);

  // メッセージ送信
  const handleSendMessage = useCallback(() => {
    if (inputValue.trim() !== '') {
      socketRef.current?.emit('chatMessage', inputValue);
      setInputValue(inputValue);
    }
  }, [inputValue, setInputValue]);

  return {
    messages,
    inputValue,
    handleInputChange,
    handleSendMessage,
  };
}
