import React, {useContext} from 'react';
import { Link } from 'react-router-dom';
import { ColyseusContext } from '../ColyseusProvider';
import './Navbar.css'

// Navbar component
const Navbar: React.FC = () => {
  const { room, leaveRoom} = useContext(ColyseusContext);
    return (
      <nav className="navbar">
        {/* Add your navigation items here */}
        <Link to="/"className='fancy-link'>Lobby</Link>
        {room!=null && <Link to="/Tonk" className='fancy-link'>TONKTIME</Link>}
        {room!=null && <Link to="/test-room"className='fancy-link'>About Room {room?.roomId}</Link>}
        {room!=null && <Link to="/"onClick={leaveRoom} className='fancy-link'>leave room {room?.roomId}</Link>}
      </nav>
    );
  };

  export default Navbar;