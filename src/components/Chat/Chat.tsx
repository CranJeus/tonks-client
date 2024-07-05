import React, { useEffect, useState, useRef, useContext } from 'react';
import { ColyseusContext } from '../../components/ColyseusProvider';
import "./Chat.css"

//Typescript definition for a message
type MessageInfo = {
  sessionId: string;
  name: string;
  message: string;
}



//component to render a message
const MessageComponent: React.FC<MessageInfo> = ({ sessionId, name, message }) => {
  function hashCode(str: string) { // java String#hashCode
    var hash = 0;
    console.log(str);
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }
  // Convert an int to RGB used to generate a color based on the sessionId
  function intToRGB(i: number) {
    var c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
  }

  return (
    <li className={'lobby_message'} style={{
      backgroundColor: "#" + intToRGB(hashCode(sessionId ? sessionId : "chasbbbbbbbbbbbbbbbb"))
    }}>
      <p>{name ? name : "Default Name"}</p>
      <p>{message}</p>
    </li>
  );
};

const Chat: React.FC = () => {
  const [message, setMessage] = useState('');
  const { client, messages, sendChatMessage } = useContext(ColyseusContext);
  const chatRef = useRef<HTMLUListElement | null>(null);

  const handleChatMessage = async () => {
    sendChatMessage(message);
  };

  useEffect(() => {
    if (!client) return;

  }, []);

  // Scroll to the bottom whenever chatMessages is updated
  useEffect(() => {
    if (!chatRef.current) return;
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="lobby__right">
      <h2>Lobby Chat</h2>
      <ul className="lobby_chat" ref={chatRef}>
        {messages.map((messageInfo, index) => (
          <MessageComponent
            key={index}
            sessionId={messageInfo.sessionId}
            name={messageInfo.name}
            message={messageInfo.message}
          />
        ))}
      </ul>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter a Message"
        />
        <button onClick={handleChatMessage}>Send Chat</button>
      </div>
    </div>
  )
}

export default Chat;