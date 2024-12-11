import { useState, useEffect } from 'react';
import WalletConnect from './WalletConnect'; // Import your WalletConnect component
import DarkToggle from './Darktoggle'; // Import your DarkToggle component
import { useNavigate } from 'react-router-dom'; // Assuming you are using React Router for navigation

const Navbar = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false); // State for dark mode

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  // Apply dark mode to body when the state changes
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  return (
    <nav
      className={`navbar ${darkMode ? 'dark-mode' : ''}`} // Apply dark-mode class conditionally
      style={{
        display: 'flex',
        height: '80px',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        background: darkMode ? 'linear-gradient(45deg, #222, #333)' : 'linear-gradient(45deg, #000, #333)',
        borderRadius: '8px',
        color: '#fff',
      }}
    >
      {/* Left Section */}
      <div
        onClick={() => navigate('/')} // Navigate to home page
        style={{
          padding: '10px 20px',
          background: darkMode ? 'linear-gradient(45deg, #555, #111)' : 'linear-gradient(45deg, #444, #111)',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
        }}
      >
        AEROTOKEN
      </div>

      {/* Middle Section */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px',
          background: darkMode ? 'linear-gradient(45deg, #555, #111)' : 'linear-gradient(45deg, #444, #111)',
          borderRadius: '8px',
          gap: '10px',
        }}
      >
        <button
          onClick={() => navigate('/book-ticket')}
          style={{
            padding: '8px 16px',
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Book Ticket
        </button>
        <button
          onClick={() => navigate('/list-nft')}
          style={{
            padding: '8px 16px',
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          List NFT
        </button>
        <button
          onClick={() => navigate('/profile')}
          style={{
            padding: '8px 16px',
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Profile
        </button>
      </div>

      {/* Right Section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px', // Space between WalletConnect and DarkToggle
          padding: '10px 20px',
        }}
      >
        <WalletConnect />
        <div style={{ marginLeft: '10px' }}>
          <DarkToggle onClick={toggleDarkMode} /> {/* Toggle dark mode onClick */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
