import { useState, useEffect } from 'react';
import WalletConnect from './WalletConnect'; // Import your WalletConnect component
import DarkToggle from './Darktoggle'; // Import your DarkToggle component
import { useNavigate, Link } from 'react-router-dom'; // Assuming you are using React Router for navigation

const Navbar = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false); // State for dark mode
  const [hoveredButton, setHoveredButton] = useState(null);

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
  className={`navbar ${darkMode ? 'dark-mode' : ''}`}
  style={{
    display: 'flex',
    height: '80px',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 20px',
    background: darkMode
      ? 'linear-gradient(45deg, #222, #333)'
      : 'linear-gradient(45deg, #000, #333)',
    borderRadius: '8px',
    color: '#fff',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)',
  }}
>
  {/* Left Section */}
  <div
    onClick={() => navigate('/')}
    style={{
      padding: '10px 20px',
      background: darkMode
        ? 'linear-gradient(45deg, #555, #111)'
        : 'linear-gradient(45deg, #444, #111)',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '1.5rem',
      fontFamily: 'Ease',
      transition: 'transform 0.2s ease',
    }}
    className="nav-logo"
  >
    AEROTOKEN
  </div>

  {/* Middle Section */}
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    }}
  >
    {[
      { name: 'Book Ticket', route: '/book-ticket' }, 
      { name: 'List NFT', route: '/list-nft' }, 
      { name: 'Profile', route: '/profile' },
      { name: 'Flight Search', route: '/flight-search' }
    ].map((item) => (
      <button
        key={item.name}
        onClick={() => navigate(item.route)}
        onMouseEnter={() => setHoveredButton(item.name)}
        onMouseLeave={() => setHoveredButton(null)}
        style={{
          padding: '8px 16px',
          background: hoveredButton === item.name ? '#444' : 'transparent',
          border: '2px solid transparent',
          borderRadius: '8px',
          color: '#fff',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '1.2rem',
          fontFamily: 'C',
          transition: 'all 0.3s ease',
          transform: hoveredButton === item.name ? 'scale(1.05)' : 'scale(1)',
        }}
        className="nav-button"
      >
        {item.name}
      </button>
    ))}
  </div>

  {/* Right Section */}
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    }}
  >
    <WalletConnect />
    <div style={{ cursor: 'pointer' }}>
      <DarkToggle onClick={toggleDarkMode} />
    </div>
  </div>

</nav>

  );
};

export default Navbar;
