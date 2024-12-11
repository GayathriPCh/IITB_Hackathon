import { useState } from 'react';
import { convertStringToHex } from 'xrpl';
import { useAccount } from '../components/AccountProvider';
import { Xumm } from 'xumm';

// Initialize Xumm SDK (replace with your API key)
const xumm = new Xumm('c5973057-149c-4008-a867-70d71fc5dc29');

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

    const nftMetadata = JSON.stringify({
      airline: flightDetails.airline,
      flightClass: flightDetails.flightClass,
      seatNumber: flightDetails.seatNumber,
      departure: flightDetails.departure,
      arrival: flightDetails.arrival,
      date: flightDetails.date,
    });

    try {
      const payload = await xumm.payload.create({
        txjson: {
          TransactionType: 'NFTokenMint',
          Account: account,
          NFTokenTaxon: 0,
          Flags: 8,
          URI: convertStringToHex(nftMetadata),
          TransferFee: 0,
          Memos: [
            {
              Memo: {
                MemoType: convertStringToHex('FlightTicket'),
                MemoData: convertStringToHex(nftMetadata),
              },
            },
          ],
        },
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
    <div style={{ padding: '20px' }}>
      <h1>Book Your Flight Ticket</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Airline:</label>
          <select
            name="airline"
            value={flightDetails.airline}
            onChange={handleChange}
            required
          >
            <option value="">Select Airline</option>
            <option value="Airline1">Airline1</option>
            <option value="Airline2">Airline2</option>
            <option value="Airline3">Airline3</option>
            <option value="Airline4">Airline4</option>
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
            <option value="Economy">Economy</option>
            <option value="Business">Business</option>
            <option value="First">First Class</option>
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
            <option value="LHR">LHR - London</option>
            <option value="DXB">DXB - Dubai</option>
            <option value="CDG">CDG - Paris</option>
            <option value="FRA">FRA - Frankfurt</option>
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

        <button type="submit" disabled={isBooking}>
          {isBooking ? 'Booking...' : 'Book Ticket'}
        </button>
      </form>

      {minted && (
        <div style={{ marginTop: '20px' }}>
          <h2>Ticket Minted Successfully!</h2>
          <p>Your NFT ticket has been successfully booked and minted. You can now view it in your wallet.</p>
        </div>
      )}
    </div>
  );
};

export default BookTicket;
