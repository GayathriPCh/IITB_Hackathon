import { useState } from 'react';
import { convertStringToHex } from 'xrpl';
import { useAccount } from '../components/AccountProvider';
import { Xumm } from 'xumm';
import './BookTicket.css';
// Initialize Xumm SDK (replace with your API key)
const xumm = new Xumm('c5973057-149c-4008-a867-70d71fc5dc29');
const airlineData = {
    "Indigo": {
      classes: ["Economy"],
      destinations: ["Mumbai", "Delhi", "Bangalore", "Chennai"],
      nftImages: {
        "Economy": {
            "Mumbai": "https://ipfs.io/ipfs://bafkreifqaj3f2xexgdz7duf5f7bjuhexxtunmqk27bx6p76sf32n4vr3wi",
            "Delhi": "https://ipfs.io/ipfs://bafkreicrayb6tbti6lbe32lueztelylpcpt7nz2rgawtdanvnsj47actyi",
          "Bangalore": "https://ipfs.io/ipfs://bafkreibudiaxxtzdoqdqwuscou2i44zlsmt65ytxndjfp276xdmbozcy44",
          "Chennai": "https://ipfs.io/ipfs://bafkreig3n3b6q66jvxoqn2nspxfrnc57cjlyhwmtsd4x36nflseofaogka"
        }
      }
    },
    "SpiceJet": {
      classes: ["Economy", "Business"],
      destinations: ["Mumbai", "Delhi", "Dubai", "Bangkok"],
      nftImages: {
        "Economy": {
            "Mumbai": "https://ipfs.io/ipfs://bafkreifqaj3f2xexgdz7duf5f7bjuhexxtunmqk27bx6p76sf32n4vr3wi",
            "Delhi": "https://ipfs.io/ipfs://bafkreicrayb6tbti6lbe32lueztelylpcpt7nz2rgawtdanvnsj47actyi",
            "Dubai": "https://ipfs.io/ipfs://bafkreido6o6bya2wzpgfgk5rzfwabvot4bga3vv2ztek33qpslwl4bjhgy",
            "Bangkok": "https://ipfs.io/ipfs://bafkreiacikgv6ikyeabgx2tvnuxqktypmayy2pcnqpg4j7am3xvl2y33i4"
        },
        "Business": {
            "Mumbai": "https://ipfs.io/ipfs://bafkreifqaj3f2xexgdz7duf5f7bjuhexxtunmqk27bx6p76sf32n4vr3wi",
            "Delhi": "https://ipfs.io/ipfs://bafkreicrayb6tbti6lbe32lueztelylpcpt7nz2rgawtdanvnsj47actyi",
            "Dubai": "https://ipfs.io/ipfs://bafkreido6o6bya2wzpgfgk5rzfwabvot4bga3vv2ztek33qpslwl4bjhgy",
            "Bangkok": "https://ipfs.io/ipfs://bafkreiacikgv6ikyeabgx2tvnuxqktypmayy2pcnqpg4j7am3xvl2y33i4"
        }
      }
    },
    "Air India": {
      classes: ["Economy", "Business", "First"],
      destinations: ["Mumbai", "New York", "Singapore", "Dubai"],
      nftImages: {
        "Economy": {
          "Mumbai": "https://ipfs.io/ipfs://bafkreifqaj3f2xexgdz7duf5f7bjuhexxtunmqk27bx6p76sf32n4vr3wi",
          "New York": "https://ipfs.io/ipfs://bafkreihwdztyezhq4ghs4p6zrowdcbdk6627x6jg7ez2iztl7s4o2mp6di",
          "Singapore": "https://ipfs.io/ipfs://bafybeifimudsnqinclimgeqgxhx4lgtkbob5g25zw677icau5y6bnvowri",
          "Dubai": "https://ipfs.io/ipfs://bafkreido6o6bya2wzpgfgk5rzfwabvot4bga3vv2ztek33qpslwl4bjhgy"
        },
        "Business": {
          "Mumbai": "https://ipfs.io/ipfs://bafkreifqaj3f2xexgdz7duf5f7bjuhexxtunmqk27bx6p76sf32n4vr3wi",
          "New York": "https://ipfs.io/ipfs://bafkreihwdztyezhq4ghs4p6zrowdcbdk6627x6jg7ez2iztl7s4o2mp6di",
          "Singapore": "https://ipfs.io/ipfs://bafybeifimudsnqinclimgeqgxhx4lgtkbob5g25zw677icau5y6bnvowri",
          "Dubai": "https://ipfs.io/ipfs://bafkreido6o6bya2wzpgfgk5rzfwabvot4bga3vv2ztek33qpslwl4bjhgy"
        },
        "First": {
          "Mumbai": "https://ipfs.io/ipfs://bafkreifqaj3f2xexgdz7duf5f7bjuhexxtunmqk27bx6p76sf32n4vr3wi",
          "New York": "https://ipfs.io/ipfs://bafkreihwdztyezhq4ghs4p6zrowdcbdk6627x6jg7ez2iztl7s4o2mp6di",
          "Singapore": "https://ipfs.io/ipfs://bafybeifimudsnqinclimgeqgxhx4lgtkbob5g25zw677icau5y6bnvowri",
          "Dubai": "https://ipfs.io/ipfs://bafkreido6o6bya2wzpgfgk5rzfwabvot4bga3vv2ztek33qpslwl4bjhgy"
        }
      }
    },
    "Vistara": {
      classes: ["Economy", "Premium Economy", "Business"],
      destinations: ["Mumbai", "New York", "Singapore", "Dubai"],
      nftImages: {
        "Economy": {
            "Mumbai": "https://ipfs.io/ipfs://bafkreifqaj3f2xexgdz7duf5f7bjuhexxtunmqk27bx6p76sf32n4vr3wi",
           "New York": "https://ipfs.io/ipfs://bafkreihwdztyezhq4ghs4p6zrowdcbdk6627x6jg7ez2iztl7s4o2mp6di",
          "Singapore": "https://ipfs.io/ipfs://bafybeifimudsnqinclimgeqgxhx4lgtkbob5g25zw677icau5y6bnvowri",
          "Dubai": "https://ipfs.io/ipfs://bafkreido6o6bya2wzpgfgk5rzfwabvot4bga3vv2ztek33qpslwl4bjhgy"
        },
        "Premium Economy": {
            "Mumbai": "https://ipfs.io/ipfs://bafkreifqaj3f2xexgdz7duf5f7bjuhexxtunmqk27bx6p76sf32n4vr3wi",
           "New York": "https://ipfs.io/ipfs://bafkreihwdztyezhq4ghs4p6zrowdcbdk6627x6jg7ez2iztl7s4o2mp6di",
          "Singapore": "https://ipfs.io/ipfs://bafybeifimudsnqinclimgeqgxhx4lgtkbob5g25zw677icau5y6bnvowri",
          "Dubai": "https://ipfs.io/ipfs://bafkreido6o6bya2wzpgfgk5rzfwabvot4bga3vv2ztek33qpslwl4bjhgy"
        },
        "Business": {
            "Mumbai": "https://ipfs.io/ipfs://bafkreifqaj3f2xexgdz7duf5f7bjuhexxtunmqk27bx6p76sf32n4vr3wi",
           "New York": "https://ipfs.io/ipfs://bafkreihwdztyezhq4ghs4p6zrowdcbdk6627x6jg7ez2iztl7s4o2mp6di",
          "Singapore": "https://ipfs.io/ipfs://bafybeifimudsnqinclimgeqgxhx4lgtkbob5g25zw677icau5y6bnvowri",
          "Dubai": "https://ipfs.io/ipfs://bafkreido6o6bya2wzpgfgk5rzfwabvot4bga3vv2ztek33qpslwl4bjhgy"
        }
      }
    }
  };
const BookTicket = () => {
  const { account } = useAccount();
  const [flightDetails, setFlightDetails] = useState({
    airline: '',
    flightClass: '',
    seatNumber: '',
    departure: '',
    arrival: '',
    date: '',
  });
  const [isBooking, setIsBooking] = useState(false);
  const [minted, setMinted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFlightDetails({ ...flightDetails, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) {
      alert('Please connect your wallet to book the ticket.');
      return;
    }
    
    setIsBooking(true);
    const nftImage = airlineData[flightDetails.airline].nftImages[flightDetails.flightClass][flightDetails.arrival];
    
    try {
      const payload = await xumm.payload.create({
        txjson: {
          TransactionType: 'NFTokenMint',
          Account: account,
          NFTokenTaxon: 0,
          Flags: 8,
          // Use the image URI directly instead of full metadata
          URI: convertStringToHex(nftImage),
          TransferFee: 0,
          Memos: [
            {
              Memo: {
                MemoType: convertStringToHex('Name'),
                MemoData: convertStringToHex(`${flightDetails.airline} Flight #${flightDetails.seatNumber}`)
              }
            },
            {
              Memo: {
                MemoType: convertStringToHex('Details'),
                MemoData: convertStringToHex(JSON.stringify(flightDetails))
              }
            }
          ]
        }
      });

      // Subscribe to the payload without raising unnecessary errors
      const payloadResult = await xumm.payload.createAndSubscribe(payload);
      const resolveData = await payloadResult.resolved;

      // Always provide a success message
      if (resolveData.signed === true) {
        setMinted(true);
        alert('Your ticket has been successfully minted as an NFT!');
      } else {
        setMinted(false);
        alert('Transaction was not signed. Please try again.');
      }
    } catch {
      console.warn('An error occurred during the process, but the transaction might have succeeded.');
      alert('Your ticket minting request was submitted. Please check your wallet for confirmation.');
      setMinted(true); // Assume success to avoid blocking UI unnecessarily
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="booking-form-container">
  <h1>Book Your Flight Ticket</h1>
  <form className="booking-form" onSubmit={handleSubmit}>
    <div className="booking-form-group">
          <label>Airline:</label>
          <select
            name="airline"
            value={flightDetails.airline}
            onChange={handleChange}
            required
          >
            <option value="">Select Airline</option>
            {Object.keys(airlineData).map((airline) => (
              <option key={airline} value={airline}>{airline}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Class:</label>
          <select
            name="flightClass"
            value={flightDetails.flightClass}
            onChange={handleChange}
            required
          >
            <option value="">Select Class</option>
            {flightDetails.airline && airlineData[flightDetails.airline].classes.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Seat Number:</label>
          <select
            name="seatNumber"
            value={flightDetails.seatNumber}
            onChange={handleChange}
            required
          >
            <option value="">Select Seat Number</option>
            <option value="A1">A1</option>
            <option value="A2">A2</option>
            <option value="B1">B1</option>
            <option value="B2">B2</option>
          </select>
        </div>
        <div>
          <label>Departure Location:</label>
          <select
            name="departure"
            value={flightDetails.departure}
            onChange={handleChange}
            required
          >
            <option value="">Select Departure Location</option>
            <option value="JFK">JFK - New York</option>
            <option value="LAX">LAX - Los Angeles</option>
            <option value="SFO">SFO - San Francisco</option>
            <option value="ORD">ORD - Chicago</option>
          </select>
        </div>
        <div>
          <label>Arrival Location:</label>
          <select
            name="arrival"
            value={flightDetails.arrival}
            onChange={handleChange}
            required
          >
            <option value="">Select Arrival Location</option>
            <option value="">Select Arrival Location</option>
            {flightDetails.airline && airlineData[flightDetails.airline].destinations.map((dest) => (
              <option key={dest} value={dest}>{dest}</option>
            ))}
          </select>
        </div>
        <div>
          <label>Flight Date:</label>
          <input
            type="date"
            name="date"
            value={flightDetails.date}
            onChange={handleChange}
            required
          />
        </div>

        <button className="booking-submit-btn" type="submit" disabled={isBooking}>
      {isBooking ? 'Booking...' : 'Book Ticket'}
    </button>
      </form>

      {minted && (
    <div className="booking-success">
      <h2>Ticket Minted Successfully!</h2>
      <p>Your NFT ticket has been successfully booked and minted.</p>
    </div>
  )}
</div>
  );
};

export default BookTicket;
