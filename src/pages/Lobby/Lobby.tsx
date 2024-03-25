import React, { useEffect, useState, useRef, useContext } from 'react';
import { Room } from 'colyseus.js';
import { useNavigate } from 'react-router-dom';
import "./Lobby.css"
import { ColyseusContext } from '../../components/ColyseusProvider';

type RoomInfo = {
  roomId: string;
  clients: number;
  maxClients: number;
  metadata: {
    name: string,
    gameState: string;
  };
};
type MessageInfo = {
  sessionId: string;
  name: string;
  message: string;
}


// Component to render a single room
const RoomComponent: React.FC<{ roomInfo: RoomInfo; joinRoom: (roomId: string) => void }> = ({ roomInfo, joinRoom }) => {
  const getRoomClass = (gameState: string) => {
    if (!gameState) return '';
    switch (gameState) {
      case 'active':
        return 'lobby__room--active';
      case 'waiting':
        return 'lobby__room--waiting';
      case 'ended':
        return 'lobby__room--ended';
      default:
        return ''; // default class if no game state matches
    }
  };

  // Get the appropriate class for the current room's game state
  const roomClass = getRoomClass(roomInfo.metadata.gameState);
  return (
    <li className={`lobby__room ${roomClass}`} onClick={() => joinRoom(roomInfo.roomId)} key={roomInfo.roomId}>
      <div className="room__name">{roomInfo.metadata.name}</div> ({roomInfo.clients}/{roomInfo.maxClients})<div className="room__gamestate">{roomInfo.metadata.gameState}</div>
    </li>
  );
};

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

  function intToRGB(i: number) {
    var c = (i & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
  }

  return (
    <li className={'lobby_message'} style={{ backgroundColor: "#" + intToRGB(hashCode(sessionId?sessionId:"chasbbbbbbbbbbbbbbbb")) }}>
        <p>{name ? name : "Default Name"}</p>
        <p>{message}</p>
    </li>
  );
};

const Lobby: React.FC = () => {
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [roomName, setRoomName] = useState('');
  const [message, setMessage] = useState('');
  //const [messages, setMessages] = useState<MessageInfo[]>([]);
  const lobbyRoomRef = useRef<Room<any> | null>(null);
  const chatRef = useRef<HTMLUListElement | null>(null);
  // Initialize Colyseus client
  const { client, chatRoom, messages, setRoom, leaveRoom, setChatRoom, leaveChatRoom, sendChatMessage } = useContext(ColyseusContext);
  const navigate = useNavigate();

  // Function to join a room
  const joinRoom = async (roomId: string) => {
    if (!client) return;
    try {
      //first we have to leave a room if we are in one
      leaveRoom();
      //then we join the room and send the client on their way
      await client.joinById(roomId).then(room => {
        // Handle successful join
        console.log("set the room to "+room);
        setRoom(room);
        navigate('/test-room');
      })

    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  // Function to join the chat room
  const joinChatRoom = async () => {
    setChatRoom();
  };

  // Function to join the lobby room
  const joinLobbyRoom = async () => {
    if (!client) return;
    try {
      //first we have to leave a room if we are in one
      lobbyRoomRef.current?.leave();
      //then we join the room and send the client on their way
      await client.joinOrCreate('lobby').then(room => {
        lobbyRoomRef.current = room;
      })

    } catch (error) {
      console.error("Error joining lobby room:", error);
    }
  };

  useEffect(() => {
    if (!client) return;
    //Join the lobby to recieve realtime updates on rooms.
    if(lobbyRoomRef.current) return;
    client.joinOrCreate('lobby').then(room => {
      lobbyRoomRef.current = room;


      //when the lobby sends us a list of rooms we set them
      room.onMessage('rooms', (rooms: RoomInfo[]) => {
        setRooms(rooms);
      });




      //handle a new room being created in the lobby
      room.onMessage("+", ([roomId, newRoom]: [string, RoomInfo]) => {
        setRooms(prevRooms => {
          // Check if the room already exists
          const existingRoomIndex = prevRooms.findIndex(room => room.roomId === roomId);
          if (existingRoomIndex !== -1) {
            // Replace the existing room with the new data
            const updatedRooms = [...prevRooms];
            updatedRooms[existingRoomIndex] = newRoom;
            return updatedRooms;
          } else {
            // Add the new room to the list of rooms
            return [...prevRooms, newRoom];
          }
        });
      });

      //if there is a message to remove a room remove it and set the rooms again
      room.onMessage("-", (roomId: string) => {
        setRooms(prevRooms => prevRooms.filter(room => room.roomId !== roomId));
      });
      //literally just to remove a warning for message types that should not occur
      room.onMessage("__playground_message_types", (message) => {
        console.log(message);
      });

    }).catch(e => {
      console.error("Join lobby error", e);
    });

    // Join the chat room
    if(!chatRoom)
      joinChatRoom();


    return () => {
      lobbyRoomRef.current?.leave();
      // Clear the rooms state when leaving the lobby
      setRooms([]);
    };
  }, []);

  // Scroll to the bottom whenever chatMessages is updated
  useEffect(() => {
    if (!chatRef.current) return;
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const handleCreateRoom = async () => {
    if (client && roomName) {
      try {
        //first we have to leave a room if we are in one
        leaveRoom();
        //then we join the room and send the client on their way
        await client.create("Tonk_Room", { name: roomName }).then(room => {
          // Handle successful join
          console.log(room);
          setRoom(room);
          setRoomName(''); // Reset room name input
          navigate('/test-room')
        })

      } catch (error) {
        console.error("Error joining room:", error);
      }
    }
  };

  const handleChatMessage = async () => {
    sendChatMessage(message);
  };

  return (
    <div className="lobby__container">
      <div className='lobby__left'>
        <h2>Rooms</h2>
        <ul className='lobby__roomlist'>
          {rooms.length > 0 ? (
            rooms.filter(s => s.metadata.name !== "Chat Room").map(room => <RoomComponent key={room.roomId} roomInfo={room} joinRoom={joinRoom} />)
          ) : (
            <p>No rooms available</p>
          )}
        </ul>
        <div>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="Enter room name"
          />
          <button onClick={handleCreateRoom}>Create Room</button>
        </div>
      </div>
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
    </div>
  );
};

export default Lobby;
