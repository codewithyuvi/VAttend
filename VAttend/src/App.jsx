import { useState } from "react";
import { PeraWalletConnect } from "@perawallet/connect";
import CheckIn from "./components/CheckInButton";

const peraWallet = new PeraWalletConnect();

function App() {

  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState(null);

  const connectWallet = async () => {
    const accounts = await peraWallet.connect();

    setWalletAddress(accounts[0]);

    // 🔥 this becomes your permanent signer — bind the method so `this` is correct
    // setSigner(peraWallet.signTransaction.bind(peraWallet));
    setSigner(() => peraWallet.signTransaction);

  };

  return (
    <>
      <button onClick={connectWallet}>Connect Wallet</button>

      <CheckIn walletAddress={walletAddress} signer={signer} />
    </>
  );
}

export default App;
