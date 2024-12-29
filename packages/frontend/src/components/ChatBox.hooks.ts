import { useCallback, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3000';

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
  const [inputValue, setInputValue] = useState('');

  // Socketはコンポーネント外でもいいが、ここでは例として関数スコープ内で管理
  let socket: Socket;

  useEffect(() => {
    // サーバに接続
    socket = io(SOCKET_URL);

    socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    // 'chatMessage'イベント受信 → messagesに追加
    socket.on('chatMessage', (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    // cleanup
    return () => {
      console.log('Disconnecting socket...');
      socket.disconnect();
    };
  }, []);

  // テキスト入力変更時
  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  // メッセージ送信
  const handleSendMessage = useCallback(() => {
    if (inputValue.trim() !== '') {
      // 現状、socket をフック内部で使うために「既にconnect済み」を仮定
      // 本来は guardチェックやRef化などを検討
      socket.emit('chatMessage', inputValue);
      setInputValue('');
    }
  }, [inputValue]);

  return {
    messages,
    inputValue,
    handleInputChange,
    handleSendMessage,
  };
}
