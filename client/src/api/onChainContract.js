import {ethers} from "ethers"
import ABI from "../../Abi.json"

const CONTRACT_ADDRESS=import.meta.env.VITE_APP_CONTRACT_ADDRESS

export const payETH=async(signer, amountInEth)=>{
    const contract=new ethers.Contract(CONTRACT_ADDRESS,ABI,signer);
    const tx=await contract.payETH({value:ethers.parseEther(amountInEth.toString())});
    await tx.wait()
    return tx.hash;
}
export const tokenPay=async(signer , amount)=>{
    const contract=new ethers.Contract(CONTRACT_ADDRESS,ABI,signer);
    const tx=await contract.payERC20(signer,ethers.parseUnits(amount.toString(),18));
    await tx.wait();
    return tx.hash;
}





