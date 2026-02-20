import { useState } from "react";
import { PeraWalletConnect } from "@perawallet/connect";
import CheckIn from "./components/CheckInButton";

const peraWallet = new PeraWalletConnect();

function App() {

  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState(null);

  const connectWallet = async () => {
  const accounts = await peraWallet.connect();

  const address = accounts[0];
  console.log("Address:", address);
  setWalletAddress(address);

  const peraSigner = async (txns, indexes) => {

    const txnsToSign = txns.map((txn, i) => ({
      txn,
      signers: indexes.includes(i) ? [address] : [],
    }));

    const signedGroups = await peraWallet.signTransaction([
      txnsToSign,
    ]);

    // ✅ RETURN RAW BYTES ONLY
    return signedGroups[0].map((s) => s.blob);
  };

  setSigner(() => peraSigner);
};

  return (
    <>
      <button onClick={connectWallet}>Connect Wallet</button>

      <CheckIn walletAddress={walletAddress} signer={signer} />
    </>
  );
}

export default App;
