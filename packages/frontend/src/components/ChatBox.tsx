import React, { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

let socket: typeof Socket;

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    socket = io('http://localhost:3000'); // backend側のWSポートに接続
    socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    socket.on('chatMessage', (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (inputValue.trim() !== '') {
      socket.emit('chatMessage', inputValue);
      setInputValue('');
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', height: '100vh', padding: 8 }}>
      <h3>ChatBox</h3>
      <div style={{ overflowY: 'auto', height: '80%' }}>
        {messages.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </div>
      <div>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') sendMessage();
          }}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
