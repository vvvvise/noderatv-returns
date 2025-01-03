import { act, renderHook } from '@testing-library/react';
import { useChatBox } from './ChatBox.hooks';

// Socket.io のモック (簡易例)
jest.mock('socket.io-client', () => {
  return {
    io: jest.fn(() => ({
      on: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
    })),
  };
});

describe('useChatBox', () => {
  it('initial states', () => {
    const { result } = renderHook(() => useChatBox());

    expect(result.current.messages).toEqual([]);
    expect(result.current.inputValue).toBe('');
  });

  it('handleInputChange updates inputValue', () => {
    const { result } = renderHook(() => useChatBox());
    act(() => {
      result.current.handleInputChange('Hello');
    });
    expect(result.current.inputValue).toBe('Hello');
  });

  it('handleSendMessage clears inputValue', () => {
    const { result } = renderHook(() => useChatBox());

    act(() => {
      result.current.handleInputChange('Test message');
      result.current.handleSendMessage();
    });

    // 送信後はinputValueが空になる想定
    expect(result.current.inputValue).toBe('');
  });
});
