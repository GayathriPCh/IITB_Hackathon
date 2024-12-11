import { useAccount } from './AccountProvider';
import './WalletConnect.css';

const WalletConnect = () => {
  const { account, connectAccount, disconnectAccount } = useAccount();

  const handleDisconnect = () => {
    const confirmDisconnect = window.confirm("Are you sure you want to disconnect?");
    if (confirmDisconnect) {
      disconnectAccount();
    }
  };

  // Truncate the address to show first 4 and last 4 characters
  const truncateAddress = (address) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <div className="container">
      {!account ? (
        <button className="button" onClick={connectAccount}>Connect Wallet</button>
      ) : (
        <button className="button" onClick={handleDisconnect}>
          Connected: {truncateAddress(account)}
        </button>
      )}
    </div>
  );
};

export default WalletConnect;
