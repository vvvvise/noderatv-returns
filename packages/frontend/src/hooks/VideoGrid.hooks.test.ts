import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { useVideoGrid } from './VideoGrid.hooks';

describe('useVideoGrid', () => {
  it('should initialize properly', () => {
    const { result } = renderHook(() => useVideoGrid());

    // remoteStreams is empty at first
    expect(result.current.remoteStreams.size).toBe(0);
    // localVideoRef is defined (but not assigned to an HTMLVideoElement yet)
    expect(result.current.localVideoRef.current).toBeNull();
    // isConnectedRef is false
    expect(result.current.isConnectedRef.current).toBe(false);
  });

  it('should handle createOffer call even if not connected', () => {
    const { result } = renderHook(() => useVideoGrid());

    act(() => {
      // This might log an error, but won't throw
      result.current.handleCreateOffer();
    });

    // Still no remote streams, no error thrown
    expect(result.current.remoteStreams.size).toBe(0);
  });

  // Add more tests for onRemoteStreamAdded etc., but you'd need to mock WebSocket
  // or test the state changes in other ways
});
