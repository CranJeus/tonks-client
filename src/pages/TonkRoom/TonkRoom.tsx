import React, { useState, useEffect, useContext } from 'react';
import { Engine, Scene, AdvancedDynamicTexture, Rectangle, TextBlock, StackPanel, Button } from 'react-babylonjs';
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
  
  return (
    <Engine antialias adaptToDeviceRatio canvasId='babylonJS'>
      <Scene>
        
          <plane name="gui-plane" size={5}>
            <advancedDynamicTexture name="adTexture" createForParentMesh hasAlpha>
              <rectangle name="rect-1" height="0.2" width="0.4" color="white" thickness={4} background="black">
                <stackPanel>
                  <textBlock text="Your Turn" color="white" fontSize={50} />
                  {['Move', 'Fire', 'Reload', 'Rotate Turret'].map((action) => (
                    <button key={action} color="white" onClick={() => handleActionClick(action as Action)}>
                      <textBlock text={action} color="white" fontSize={20} />
                    </button>
                  ))}
                </stackPanel>
              </rectangle>
            </advancedDynamicTexture>
          </plane>
        
        {/* rest of your scene */}
      </Scene>
    </Engine>
  );
}

export default TonkRoom;