import React, { useState, useEffect, useContext } from 'react';
import { ColyseusContext } from '../../components/ColyseusProvider';

type Action = 'Move' | 'Fire' | 'Reload' | 'Rotate Turret';

function TonkRoom() {
  const { room } = useContext(ColyseusContext);
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);
  const [actions, setActions] = useState<Action[]>([]);

  useEffect(() => {
    if (room) {
      room.onMessage('turn', (message) => {
        setCurrentPlayer(message.playerId);
        setActions([]); // Reset actions at the start of each turn
      });
    }
  }, [room]);

  const handleActionClick = (action: Action) => {
    if(!room)return;
    if (actions.length < 3) {
      setActions([...actions, action]);
    }

    if (actions.length === 2) {
      room.send('actions', actions.concat(action));
    }
  };

  if(!room)return;
  
  return (<div></div>
  );
}

export default TonkRoom;