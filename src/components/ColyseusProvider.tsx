import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Client, Room } from 'colyseus.js';

interface ColyseusProviderProps {
  children: ReactNode; // Explicitly define the type for children
}
interface IColyseusContext {
  client: Client | null;
  room: Room<any> | null;
  chatRoom: Room<any> | null;
  lobbyRoom: Room<any> | null;
  setRoom: (room: Room<any>) => void;
  setChatRoom: () => Promise<Room<any>>;
  setLobbyRoom: (room: Room<any>) => void;
  leaveRoom: () => void;
  leaveChatRoom: () => void;
  leaveLobbyRoom: () => void;
}

const defaultState: IColyseusContext = {
  client: null,
  room: null,
  chatRoom: null,
  lobbyRoom: null,
  setRoom: () => { },
  setChatRoom: () => { },
  setLobbyRoom: () => { },
  leaveRoom: () => { },
  leaveChatRoom: () => { },
  leaveLobbyRoom: () => { },
};

export const ColyseusContext = createContext<IColyseusContext>(defaultState);
const client = new Client('ws://localhost:2567');
console.log("client created");

export const ColyseusProvider: React.FC<ColyseusProviderProps> = ({ children }) => {
  const [room, setRoom] = useState<Room<any> | null>(null);
  const [chatRoom, setChatRoom] = useState<Room<any> | null>(null);
  const [lobbyRoom, setLobbyRoom] = useState<Room<any> | null>(null);

  useEffect(() => {
  }, [])

  useEffect(() => {
    console.log("set the room", room);
  }, [room]);

  const handleSetRoom = useCallback(async (newRoom: Room<any>) => {
    setRoom(newRoom);
    console.log("set the room", room);
  }, []);

  const handleSetChatRoom = useCallback(async () => {
    if (!client) return;
    if(chatRoom) return;
    try {
      //then we join the room and send the client on their way
      await client.joinOrCreate("chat").then(room => {
        // Handle successful join
        console.log("set the room to " + room);
        setChatRoom(room);

        //set the onMessage handler for the chatroom
        room.onMessage("messages", (message) => {
          console.log(message);
          setMessages(prevMessages => [...prevMessages, message]);
        });
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

  return (
    <ColyseusContext.Provider value={{
      client: client, room, chatRoom, lobbyRoom,
      setRoom: handleSetRoom, setChatRoom: handleSetChatRoom, setLobbyRoom: handleSetLobbyRoom, 
      leaveRoom: handleLeaveRoom, leaveChatRoom: handleLeaveChatRoom, leaveLobbyRoom: handleLeaveLobbyRoom
    }}>
      {children}
    </ColyseusContext.Provider>
  );
};
