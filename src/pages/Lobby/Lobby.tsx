import React from 'react';
import "./Lobby.css"
import ServerBrowser from '../../components/ServerBrowser/ServerBrowser';
import Chat from '../../components/Chat/Chat';

const Lobby: React.FC = () => {
  // Initialize Colyseus client
  return (
    <div className="lobby__container">
      <ServerBrowser></ServerBrowser>
      <Chat></Chat>
    </div>
  );
};

export default Lobby;
