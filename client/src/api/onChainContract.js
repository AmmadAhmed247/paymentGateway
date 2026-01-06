import {ethers} from "ethers"
import ABI from "../../Abi.json"

const CONTRACT_ADDRESS=import.meta.env.VITE_APP_CONTRACT_ADDRESS

export const payETH=async(signer, amountInEth)=>{
    const contract=new ethers.Contract(CONTRACT_ADDRESS,ABI,signer);
    const tx=await contract.payETH({value:ethers.parseEther(amountInEth.toString())});
    await tx.wait()
    return tx.hash;
}
export const tokenPay = async (signer, amount) => {
    const NEX_TOKEN_ADDRESS = "0x61d9909C349d016Ee099e277A6203369873c776e"; 
    const GATEWAY_ADDRESS = "0x33C487e1B20E3870458738c78eaECF7f833f7f19"; //gatewayaddress
    const tokenAbi = ["function approve(address spender, uint256 amount) public returns (bool)"];
    const tokenContract = new ethers.Contract(NEX_TOKEN_ADDRESS, tokenAbi, signer);
    const parsedAmount = ethers.parseUnits(amount.toString(), 18);
    console.log("Requesting Approval for tokens...");
    const approveTx = await tokenContract.approve(GATEWAY_ADDRESS, parsedAmount);
    await approveTx.wait(); 
    console.log("Approval Confirmed!");
    const gatewayContract = new ethers.Contract(GATEWAY_ADDRESS, ABI, signer);
    const tx = await gatewayContract.payERC20(NEX_TOKEN_ADDRESS, parsedAmount); 
    await tx.wait();
    return tx.hash;
};





