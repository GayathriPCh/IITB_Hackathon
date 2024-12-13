import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BookTicket from './pages/BookTicket';
import ListNFT from './pages/ListNFT';
import Profile from './pages/Profile';
import FlightSearch from './pages/FlightSearch';
import { AccountProvider } from './components/AccountProvider';
import './App.css';
const App = () => {
  return (
    <AccountProvider>
    <Router>
      {/* Navbar displayed on all pages */}
      <Navbar />
      {/* Define Routes */}
      <div style={{ marginTop: '20px' }}> {/* Ensures content isn't hidden by navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book-ticket" element={<BookTicket />} />
          <Route path="/list-nft" element={<ListNFT />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/flight-search" element={<FlightSearch />} />
        </Routes>
      </div>
    </Router>
    </AccountProvider>
  );
};

export default App;
