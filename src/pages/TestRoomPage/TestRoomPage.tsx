// TestRoomPage.tsx

import React, { useContext, useEffect} from 'react';
import { ColyseusContext } from '../../components/ColyseusProvider';

const TestRoomPage: React.FC = () => {
  const { room} = useContext(ColyseusContext);

  useEffect(() => {
    if(!room) return;
  }, []);

  if (!room) {
    return <div>No active room. Room state has not been persisted.</div>;
  }

  return (
    <div>
      <h1>Room Test Page</h1>
      <p>Room ID: {room.id}</p>
    </div>
  );
};

export default TestRoomPage;
