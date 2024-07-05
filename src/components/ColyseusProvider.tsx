/**
 * Provides a context for managing Colyseus client and rooms.
 */
import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Client, Room } from 'colyseus.js';
import LoginPage  from '../pages/Login/Login';

interface ColyseusProviderProps {
  children: ReactNode; // Explicitly define the type for children
}

type MessageInfo = {
  sessionId: string;
  name: string;
  message: string;
}


interface ChatRoomOptions {
  name: string;
};


interface IColyseusContext {
  client: Client | null;
  room: Room<any> | null;
  chatRoom: Room<any> | null;
  lobbyRoom: Room<any> | null;
  messages: MessageInfo[];
  setRoom: (room: Room<any>) => void;
  setChatRoom: (name: string) => void;
  setLobbyRoom: (room: Room<any>) => void;
  leaveRoom: () => void;
  leaveChatRoom: () => void;
  leaveLobbyRoom: () => void;
  sendChatMessage: (message:string) => void;
}

const defaultState: IColyseusContext = {
  client: null,
  room: null,
  chatRoom: null,
  lobbyRoom: null,
  messages: [],
  setRoom: () => { },
  setChatRoom: () => { },
  setLobbyRoom: () => { },
  leaveRoom: () => { },
  leaveChatRoom: () => { },
  leaveLobbyRoom: () => { },
  sendChatMessage: () => { },
};




export const ColyseusContext = createContext<IColyseusContext>(defaultState);
const client = new Client('ws://localhost:2567');

export const ColyseusProvider: React.FC<ColyseusProviderProps> = ({ children }) => {
  //provider will use isloggedIn locally and return the other states to the children
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(''); // Change username to name
  const [room, setRoom] = useState<Room<any> | null>(null);
  const [chatRoom, setChatRoom] = useState<Room<any> | null>(null);
  const [lobbyRoom, setLobbyRoom] = useState<Room<any> | null>(null);
  const [messages, setMessages] = useState<MessageInfo[]>([]);
  let connecting = false;

  useEffect(() => {
  }, [])

  const handleLogin = (name:string) => {
    console.log("name inside function", name);
    setUserName(name);
    setIsLoggedIn(true);
    handleSetChatRoom(name);
  };

  const handleSetRoom = useCallback(async (newRoom: Room<any>) => {
    setRoom(newRoom);
    console.log("set the room", room);
  }, []);


  // Function to join the chat room and set up message handling
  const handleSetChatRoom = useCallback(async (name: string) => {
    if (!client) return;
    
    if(chatRoom || connecting) return;

    connecting = true;
    try {
      const options: ChatRoomOptions = { name: name };
      //then we join the room and send the client on their way
      await client.joinOrCreate("chat",options).then(room => {
        // Handle successful join
        console.log("set the room to " + room);
        setChatRoom(room);
        
        // Handle incoming messages and add them to the state
        room.onMessage("messages", (message:MessageInfo) => {
          console.log(message);
          setMessages(prevMessages => [...prevMessages, message]);
        });

        connecting = false;
      })

    } catch (error) {
      console.error("Error joining chat room:", error);
    }

  }, []);

  const handleSetLobbyRoom = useCallback(async (newRoom: Room<any>) => {
    setLobbyRoom(newRoom);
    console.log("set the Lobby Room", chatRoom);

  }, []);

  const handleLeaveRoom = useCallback(async () => {
    if (room) {
      room.leave();
      setRoom(null);
    }
  }, [room]);
  const handleLeaveChatRoom = useCallback(async () => {
    if (chatRoom) {
      chatRoom.leave();
      setChatRoom(null);
    }
  }, [chatRoom]);
  const handleLeaveLobbyRoom = useCallback(async () => {
    if (chatRoom) {
      chatRoom.leave();
      setChatRoom(null);
    }
  }, [lobbyRoom]);

  const handleSendChatMessage = useCallback(async (message:string) => {
    if (chatRoom && message) {
      chatRoom.send("message", message);
    }
  }, [chatRoom]);

  return (
    <ColyseusContext.Provider value={{
      client: client, room, chatRoom, lobbyRoom,messages,
      setRoom: handleSetRoom,  setLobbyRoom: handleSetLobbyRoom, setChatRoom: handleSetChatRoom,
      leaveRoom: handleLeaveRoom, leaveChatRoom: handleLeaveChatRoom, leaveLobbyRoom: handleLeaveLobbyRoom, sendChatMessage: handleSendChatMessage
    }}>
      {isLoggedIn ? children : <LoginPage onLogin={handleLogin} />}
    </ColyseusContext.Provider>
  );
};
