import React, { createContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Client, Room } from 'colyseus.js';

interface ColyseusProviderProps {
    children: ReactNode; // Explicitly define the type for children
  }
interface IColyseusContext {
  client: Client | null;
  room: Room<any> | null;
  setRoom: (room: Room<any>) => void;
  leaveRoom: () => void;
}

const defaultState: IColyseusContext = {
  client: null,
  room: null,
  setRoom: () => {},
  leaveRoom: () => {},
};

export const ColyseusContext = createContext<IColyseusContext>(defaultState);
const client = new Client('ws://localhost:2567');

export const ColyseusProvider: React.FC<ColyseusProviderProps> = ({ children }) => {
  const [room, setRoom] = useState<Room<any> | null>(null);
  console.log("the provider is being rendered again");
  
  useEffect(() => {
    console.log("set the room",room);
  }, [room]);
  const handleSetRoom = useCallback((newRoom: Room<any>) => {
    setRoom(newRoom);
    console.log("set the room",room);
    
  }, []);

  const handleLeaveRoom = useCallback(() => {
    if (room) {
      room.leave();
      setRoom(null);
    }
  }, [room]);

  return (
    <ColyseusContext.Provider value={{ client: client, room, setRoom: handleSetRoom, leaveRoom: handleLeaveRoom }}>
      {children}
    </ColyseusContext.Provider>
  );
};
