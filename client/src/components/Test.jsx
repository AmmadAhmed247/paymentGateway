import React from "react";
import { ethers } from "ethers";
import { useWallet } from "../context/WalletContext.jsx";
import { payETH } from "../api/onChainContract.js";

export default function TestPayButton() {
  const { account, connectWallet } = useWallet();

  const handlePay = async () => {
    if (!account) return connectWallet();

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const txHash = await payETH(signer, "0.00001"); // 0.01 ETH
    console.log("Payment tx hash:", txHash);
    alert("Payment sent! Check your dashboard.");
  };

  return <button onClick={handlePay} className="bg-blue-500 p-2 rounded-md text-white">Test Pay 0.0001 ETH</button>;
}
