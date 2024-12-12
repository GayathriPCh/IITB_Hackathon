import { useState, useEffect } from 'react';
import { useAccount } from '../components/AccountProvider';
import { Client } from 'xrpl';
import './ListNFT.css';
function convertHexToString(hex) {
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

const Profile = () => {
  const { account } = useAccount();
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNFTs = async () => {
      if (!account) return;
  
      const client = new Client('wss://s.altnet.rippletest.net:51233');
  
      try {
        await client.connect();
        const response = await client.request({
          command: 'account_nfts',
          account: account,
        });
  
        const userNFTs = response.result.account_nfts.map((nft) => {
          console.log('NFT Raw Data:', nft);
          
          let details = {};
          let imageUrl = null;
          
          if (nft.URI) {
            try {
              const decodedUri = convertHexToString(nft.URI);
              
              // Check if URI is a direct IPFS link
              if (decodedUri.startsWith('ipfs://')) {
  // Replace 'ipfs://' with 'https://ipfs.io/ipfs/'
  imageUrl = decodedUri.replace('ipfs://', 'https://ipfs.io/ipfs/');
} else if (decodedUri.startsWith('{')) {
  details = JSON.parse(decodedUri);
  // Handle IPFS link in image field
  if (details.image?.startsWith('ipfs://')) {
    imageUrl = details.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
  } else if (details.image?.startsWith('https://ipfs.io/ipfs://')) {
    // Remove extra colon and slash in IPFS link
    imageUrl = details.image.replace('https://ipfs.io/ipfs://', 'https://ipfs.io/ipfs/');
  } else {
    imageUrl = details.image;
  }
} else if (decodedUri.startsWith('http')) {
  if (decodedUri.startsWith('https://ipfs.io/ipfs://')) {
    // Remove extra colon and slash in IPFS link
    imageUrl = decodedUri.replace('https://ipfs.io/ipfs://', 'https://ipfs.io/ipfs/');
  } else {
    imageUrl = decodedUri;
  }
}

            } catch (e) {
              console.error('Error parsing URI:', e);
            }
          }
  
          return {
            tokenId: nft.NFTokenID,
            uri: imageUrl,
            name: details.name || 'Flight Ticket',
            details: {
              airline: details.airline || 'N/A',
              flightClass: details.flightClass || 'N/A',
              seatNumber: details.seatNumber || 'N/A',
              departure: details.departure || 'N/A',
              arrival: details.arrival || 'N/A',
              date: details.date || 'N/A'
            }
          };
        });
  
        setNfts(userNFTs);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        setLoading(false);
        client.disconnect();
      }
    };
  
    fetchNFTs();
  }, [account]);
  

  return (
    <div className="list-nft-container">
      <h1>My Flight Tickets</h1>
      
      {loading ? (
        <div className="loading-state">
          <p>Loading your tickets...</p>
        </div>
      ) : nfts.length === 0 ? (
        <div className="empty-state">
          <p>No flight tickets found in your wallet</p>
        </div>
      ) : (
        <div className="tickets-grid">
          {nfts.map((nft) => (
            <div key={nft.tokenId} className="ticket-card">
              <div className="ticket-image">
                {nft.uri ? (
                  <img src={nft.uri} alt="Flight Ticket" />
                ) : (
                  <p>No Image Available</p>
                )}
              </div>
              <div className="ticket-details">
                <h3>{nft.name}</h3>
                <div className="ticket-info">
                  <p><span>Airline:</span> {nft.details.airline}</p>
                  <p><span>Class:</span> {nft.details.flightClass}</p>
                  <p><span>Seat:</span> {nft.details.seatNumber}</p>
                  <p><span>Route:</span> {nft.details.departure} → {nft.details.arrival}</p>
                  <p><span>Date:</span> {nft.details.date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
};

export default Profile;
