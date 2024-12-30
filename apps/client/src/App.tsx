import React from 'react';
import VideoGrid from './components/VideoGrid';
import ChatBox from './components/ChatBox';

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: '0 0 80%' }}>
        <VideoGrid />
      </div>
      <div style={{ flex: '0 0 20%' }}>
        <ChatBox />
      </div>
    </div>
  );
}

export default App;
