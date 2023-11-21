import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import { ColyseusContext } from '../ColyseusProvider';

// Navbar component
const Navbar: React.FC = () => {
  const { room, leaveRoom} = useContext(ColyseusContext);
    return (
      <nav className="navbar">
        {/* Add your navigation items here */}
        <Link to="/">Lobby</Link>
        {room!=null && <Link to="/Tonk">TONKTIME</Link>}
        {room!=null && <Link to="/test-room">About Room {room?.roomId}</Link>}
        {room!=null && <button onClick={leaveRoom}>leave room {room?.roomId}</button>}
      </nav>
    );
  };

  export default Navbar;