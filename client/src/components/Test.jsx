import React from "react";
import { ethers } from "ethers";
import { useWallet } from "../context/WalletContext.jsx";
import { payETH ,tokenPay } from "../api/onChainContract.js";

export default function TestPayButton() {
  const { account, connectWallet } = useWallet();
  

  const handleETHPay = async () => {
    if (!account) return connectWallet();

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const txHash = await payETH(signer, "0.00001"); 
    console.log("Payment tx hash:", txHash);
    alert("Payment sent! Check your dashboard.");
  };
  const handleNativeToken=async()=>{
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const txHash=await  tokenPay(signer,"10");
    console.log(("payement TX Hash-- ",txHash));
    

  }

  return <>
  <button onClick={handleETHPay} className="bg-blue-500 p-2 rounded-md text-white">Test Pay  ETH</button>
  <button onClick={handleNativeToken} className="bg-blue-500 p-2 rounded-md text-white">Test Pay (erc20) Van</button>
  
  </> 
  
}
