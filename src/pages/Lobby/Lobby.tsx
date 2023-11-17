import React, { useEffect, useState } from 'react';
import { Client } from 'colyseus.js';

// Define the type for room information
type RoomInfo = {
  roomId: string;
  name: string;
  clients: number;
  maxClients: number;
};

// Component to render a single room
const Room: React.FC<{ roomInfo: RoomInfo; joinRoom: (roomId: string) => void }> = ({ roomInfo, joinRoom }) => {
  return (
    <div onClick={() => joinRoom(roomInfo.roomId)}>
      {roomInfo.name} ({roomInfo.clients}/{roomInfo.maxClients})
    </div>
  );
};

// Lobby component
const Lobby: React.FC = () => {
  const [rooms, setRooms] = useState<RoomInfo[]>([]);

  // Initialize the Colyseus client
  const client = new Client('ws://localhost:2567');

  // Fetch the list of rooms
  const fetchRooms = async () => {
    try {
      const availableRooms = await client.getAvailableRooms<RoomInfo>('Tonk_Room');
      setRooms(availableRooms.map(room => ({
        roomId: room.roomId,
        name: "asd",
        clients: room.clients,
        maxClients: room.maxClients,
      })));
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  // Function to join a room
  const joinRoom = async (roomId: string) => {
    try {
      await client.joinById(roomId);
      // Handle successful join
    } catch (error) {
      console.error("Error joining room:", error);
    }
  };

  // Function to create a new room
  const createRoom = async () => {
    try {
      await client.create('your_room_type');
      // Handle room creation and join the room
      fetchRooms(); // Refresh the room list
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div>
      <div>
        {rooms.length > 0 ? (
          rooms.map(room => <Room key={room.roomId} roomInfo={room} joinRoom={joinRoom} />)
        ) : (
          <p>No rooms available</p>
        )}
      </div>
      <button onClick={createRoom}>Create Room</button>
    </div>
  );
};

export default Lobby;
