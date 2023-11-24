import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Client, Room } from 'colyseus.js';

interface ColyseusProviderProps {
    children: ReactNode; // Explicitly define the type for children
  }
interface IColyseusContext {
  client: Client | null;
  room: Room<any> | null;
  chatRoom: Room<any> | null;
  setRoom: (room: Room<any>) => void;
  setChatRoom: (room: Room<any>) => void;
  leaveRoom: () => void;
  leaveChatRoom: () => void;
}

const defaultState: IColyseusContext = {
  client: null,
  room: null,
  chatRoom: null,
  setRoom: () => {},
  setChatRoom: () => {},
  leaveRoom: () => {},
  leaveChatRoom: () => {},
};

export const ColyseusContext = createContext<IColyseusContext>(defaultState);
const client = new Client('ws://localhost:2567');

export const ColyseusProvider: React.FC<ColyseusProviderProps> = ({ children }) => {
  const [room, setRoom] = useState<Room<any> | null>(null);
  const [chatRoom, setChatRoom] = useState<Room<any> | null>(null);

  useEffect(() => {
  },[])
  
  useEffect(() => {
    console.log("set the room",room);
  }, [room]);
  const handleSetRoom = useCallback((newRoom: Room<any>) => {
    setRoom(newRoom);
    console.log("set the room",room);
    
  }, []);
  
  const handleSetChatRoom = useCallback((newRoom: Room<any>) => {
    setChatRoom(newRoom);
    console.log("set the Chatroom",chatRoom);
    
  }, []);

  const handleLeaveRoom = useCallback(() => {
    if (room) {
      room.leave();
      setRoom(null);
    }
  }, [room]);
  const handleLeaveChatRoom = useCallback(() => {
    if (chatRoom) {
      chatRoom.leave();
      setChatRoom(null);
    }
  }, [chatRoom]);

  return (
    <ColyseusContext.Provider value={{ client: client, room, chatRoom, setRoom: handleSetRoom,setChatRoom:handleSetChatRoom, leaveRoom: handleLeaveRoom, leaveChatRoom: handleLeaveChatRoom }}>
      {children}
    </ColyseusContext.Provider>
  );
};
