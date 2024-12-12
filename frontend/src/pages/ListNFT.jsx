import { useState, useEffect } from 'react';
import { useAccount } from '../components/AccountProvider'; // Import your AccountProvider
import { Client } from 'xrpl'; // Client to interact with XRPL
import { Xumm } from 'xumm'; // Ensure you import Xumm SDK
import './ListNFT.css';
const xumm = new Xumm('c5973057-149c-4008-a867-70d71fc5dc29');

function convertHexToString(hex) {
  let str = '';
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
}

const ListNFT = () => {
  const { account } = useAccount();  // Get the connected account from AccountProvider
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNFTs, setSelectedNFTs] = useState([]);
  const [resellPrice, setResellPrice] = useState('');
  const [isReselling, setIsReselling] = useState(false);

  // Fetch NFTs from the wallet on component mount
  useEffect(() => {
    const fetchNFTs = async () => {
      if (!account) return;

      const client = new Client('wss://s.altnet.rippletest.net:51233'); // Testnet
      try {
        console.log('Connecting to XRPL client...');
        await client.connect();
        console.log('Client connected, fetching NFTs...');
        
        const response = await client.request({
          command: 'account_nfts',
          account: account,
        });
        
        console.log('Response from account_nfts:', response);
        
        const userNFTs = response.result.account_nfts.map((nft) => {
          console.log('NFT Raw Data:', nft);

          let details = {};
          let imageUrl = null;

          if (nft.URI) {
            try {
              const decodedUri = convertHexToString(nft.URI);
              console.log('Decoded URI:', decodedUri);

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

        console.log('Fetched NFTs:', userNFTs);
        setNfts(userNFTs);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
      } finally {
        console.log('NFT fetch complete.');
        setLoading(false);
        client.disconnect();
      }
    };

    fetchNFTs();
  }, [account]);

  // Handle NFT selection for resell
  const handleSelectNFT = (tokenId) => {
    console.log('Selecting NFT with Token ID:', tokenId);
    setSelectedNFTs(prev => {
      if (prev.includes(tokenId)) {
        console.log('Deselecting NFT:', tokenId);
        return prev.filter(id => id !== tokenId);
      }
      if (prev.length < 2) {
        console.log('Adding NFT to selected:', tokenId);
        return [...prev, tokenId];
      }
      console.log('Maximum 2 NFTs allowed to resell');
      return prev;
    });
  };

  // Handle reselling NFTs
  const handleResell = async () => {
    console.log('Attempting to resell NFTs...');
    if (!resellPrice || selectedNFTs.length === 0) {
      console.log('Missing resell price or no NFTs selected');
      return;
    }
    setIsReselling(true);

    try {
      for (const tokenId of selectedNFTs) {
        console.log(`Creating resell offer for NFT: ${tokenId}`);

        const payload = await xumm.payload.create({
          txjson: {
            TransactionType: "NFTokenCreateOffer",
            Account: account,
            NFTokenID: tokenId,
            Amount: String(Number(resellPrice) * 1000000), // Convert XRP to drops
            Flags: 1 // Sell offer
          }
        });
        
        console.log('Payload created:', payload);

        // Subscribe to the payload to wait for user signing
        const payloadResult = await xumm.payload.createAndSubscribe(payload);
        const resolveData = await payloadResult.resolved;

        console.log('Payload resolved:', resolveData);

        if (resolveData.signed === true) {
          console.log(`Sell offer created for NFT: ${tokenId}`);
        } else {
          console.log(`User rejected sell offer for NFT: ${tokenId}`);
        }
      }

      alert('Please check your XUMM wallet to sign the transaction');
    } catch (error) {
      console.error('Error creating resell offers:', error);
      alert('Failed to create resell offers');
    } finally {
      setIsReselling(false);
    }
  };

  return (
    <div className="list-nft-container">
      <h1>Choose any of your NFTs(upto 2 possible) to create Resell offers </h1>
      
      {selectedNFTs.length > 0 && (
        <div className="resell-controls">
          <input
            type="number"
            value={resellPrice}
            onChange={(e) => setResellPrice(e.target.value)}
            placeholder="Enter resell price in XRP"
            min="0"
          />
          <button 
            onClick={handleResell}
            disabled={isReselling || !resellPrice}
            className="resell-button"
          >
            {isReselling ? 'Creating Offers...' : 'Resell Selected Tickets'}
          </button>
        </div>
      )}

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
            <div 
              key={nft.tokenId} 
              className={`ticket-card ${selectedNFTs.includes(nft.tokenId) ? 'selected' : ''}`}
              onClick={() => handleSelectNFT(nft.tokenId)}
            >
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

export default ListNFT;
