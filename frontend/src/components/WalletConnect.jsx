import { useAccount } from './AccountProvider';

const WalletConnect = () => {
  const { account, connectAccount, disconnectAccount } = useAccount();

  return (
    <div>
      {!account ? (
        <button onClick={connectAccount}>Connect Wallet</button>
      ) : (
        <div>
          <p>Connected: {account}</p>
          <button onClick={disconnectAccount}>Disconnect</button>
        </div>
      )}
    </div>
  );
};

export default WalletConnect;