import React from 'react';
import { motion } from 'framer-motion';
import './FlightSearch.css';

const FlightSearch = () => {
  const handleSearchClick = () => {
    window.open('https://www.google.com/travel/flights', '_blank');
  };

  return (
    <motion.div
      className="flight-search-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1>Search Flights</h1>
      <motion.button
        className="search-flights-btn"
        onClick={handleSearchClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Search Flights on Google
      </motion.button>
    </motion.div>
  );
};

export default FlightSearch; 