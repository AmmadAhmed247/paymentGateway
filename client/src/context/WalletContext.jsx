import {  useState } from "react";
import { createContext, useContext, useEffect } from "react";
import {ethers} from "ethers"

const WalletContext=createContext()

export const WalletProvider=({children})=>{
    const [account,setAccount]=useState(null)
    const [connecting, setConnecting] = useState(false);

    const connectWallet=async()=>{
        if(!window.ethereum)return ;

        try {
            setConnecting(true);
            const accounts=await window.ethereum.request({method:"eth_requestAccounts"});
            setAccount(accounts[0])
        } catch (error) {
            console.error(error);
            
        } finally {
      setConnecting(false);
    }
    }

    useEffect(() => {
    if (!window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);

    provider.send("eth_accounts", []).then((accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    });

    const handleAccountsChanged = (accounts) => {
      setAccount(accounts[0] || null);
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum.removeListener(
        "accountsChanged",
        handleAccountsChanged
      );
    };
  }, []);

    return (
    <WalletContext.Provider value={{ account, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);


