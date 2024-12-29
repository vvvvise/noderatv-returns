import React, { ChangeEvent, KeyboardEvent } from 'react';
import styled from 'styled-components';
import { useChatBox } from './ChatBox.hooks';

const ChatBoxContainer = styled.div`
  border: 1px solid #ccc;
  height: 100vh;
  padding: 8px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  margin: 0 0 8px;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  margin-bottom: 8px;
`;

const InputArea = styled.div`
  display: flex;
  gap: 4px;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 4px;
  border: 1px solid #ccc;
`;

const SendButton = styled.button`
  flex-shrink: 0;
  padding: 4px 8px;
  cursor: pointer;

  &:hover {
    background-color: #efefef;
  }
`;

/**
 * ChatBoxコンポーネント
 * - ロジックは useChatBox() フックに任せて、
 *   ここではUI表示とユーザー入力に注力
 */
export const ChatBox: React.FC = () => {
  const {
    messages,
    inputValue,
    handleInputChange,
    handleSendMessage,
  } = useChatBox();

  // 入力変更ハンドラ
  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e.target.value);
  };

  // Enterキー押下時にメッセージ送信
  const onKeyDownInput = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <ChatBoxContainer>
      <Title>ChatBox</Title>

      <MessagesContainer>
        {messages.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </MessagesContainer>

      <InputArea>
        <ChatInput
          value={inputValue}
          onChange={onChangeInput}
          onKeyDown={onKeyDownInput}
        />
        <SendButton onClick={handleSendMessage}>Send</SendButton>
      </InputArea>
    </ChatBoxContainer>
  );
};

export default ChatBox;
