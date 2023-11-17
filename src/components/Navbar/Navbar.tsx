import React from 'react';

// Navbar component
const Navbar: React.FC = () => {
    return (
      <nav className="navbar">
        {/* Add your navigation items here */}
        <a href="/">Home</a>
        <a href="/Tonk">Rooms</a>
        <a href="/about">About</a>
      </nav>
    );
  };

  export default Navbar;