import React from 'react';
const Footer: React.FC = () => {
    return (
      <footer className="footer">
        {/* Add your footer content here */}
        <p>&copy; {new Date().getFullYear()} JRGameS</p>
      </footer>
    );
  };

  export default Footer;