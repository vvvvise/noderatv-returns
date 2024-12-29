import React, { memo } from 'react';
import styled from 'styled-components';
import { useVideoGrid } from './VideoGrid.hooks';

// ----- styled-components -----
const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 8px;
`;

const Controls = styled.div`
  margin-bottom: 8px;
`;

const OfferButton = styled.button`
  padding: 8px 16px;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 8px;
  max-width: 100%;
`;

const StyledVideo = styled.video<{ $isLocal?: boolean }>`
  width: 100%;
  background-color: ${({ $isLocal }) => ($isLocal ? '#222' : '#333')};
`;

// ----- VideoElement -----
interface VideoElementProps {
  stream: MediaStream;
  isLocal?: boolean;
}
const VideoElement: React.FC<VideoElementProps> = ({ stream, isLocal }) => {
  return (
    <StyledVideo
      autoPlay
      muted={!!isLocal}
      ref={(videoEl) => {
        if (videoEl && !isLocal) {
          videoEl.srcObject = stream;
        }
      }}
      $isLocal={isLocal}
    />
  );
};

interface VideoGridProps {
  className?: string;
}

const VideoGrid: React.FC<VideoGridProps> = memo(({ className }) => {
  const {
    remoteStreams,
    localVideoRef,
    isConnectedRef,
    handleCreateOffer
  } = useVideoGrid(); // カスタムフック呼び出し

  return (
    <Container className={className}>
      <Controls>
        <OfferButton
          onClick={handleCreateOffer}
          disabled={!isConnectedRef.current}
        >
          Create Offer
        </OfferButton>
      </Controls>

      <GridContainer>
        {/* ローカル映像 */}
        <StyledVideo
          autoPlay
          muted
          $isLocal
          ref={localVideoRef}
        />

        {/* リモート映像群 */}
        {Array.from(remoteStreams.values()).map((stream) => (
          <VideoElement key={stream.id} stream={stream} />
        ))}
      </GridContainer>
    </Container>
  );
});

VideoGrid.displayName = 'VideoGrid';

export default VideoGrid;
