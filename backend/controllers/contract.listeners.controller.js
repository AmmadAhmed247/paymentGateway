import Payment from "../models/Payment.js";
import {ethers} from "ethers"
import fs from "fs"
import path from "path";
import dotenv from "dotenv"
dotenv.config()
const abiPath = path.resolve("./Contract.Abi.json"); 
const abi = JSON.parse(fs.readFileSync(abiPath, "utf8"));
const CONTRACT_ADDRESS=process.env.CONTRACT_ADDRESS
const provider=new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const contract=new ethers.Contract(CONTRACT_ADDRESS,abi,provider);



export const listenPaymentRecieved=async()=>{
    contract.on("paymentRecieved",async(sender, token,amount, fees, timestamp,event)=>{
        try {
            const exists=await Payment.findOne({txHash:event.log.transactionHash});
        if(exists)return;

        await Payment.create({
            customer:sender,
            amount:amount.toString(),
            token:token,
            fees:fees.toString(),
            timestamp:Number(timestamp),
            refunded:false,
            withdrawn:false,
            blockNumber:event.blockNumber
        });
        console.log(("Payment Recieved:",sender,":","Amount:",amount));
        } catch (error) {
            console.error(error);
        }       
    })
}

export const listenRefunded=()=>{
    contract.on("refunded",async(payer , token ,amount , event)=>{
        try {
            await Payment.findOneAndUpdate(
                {customer:payer , token , amount:amount.toString(),refunded:false},
                {refunded:true}
            )
            console.log(`Refunded update:${payer} ${token} ${amount}`);
            
        } catch (error) {
            console.error("Errow updating refund",error.message);  
        }
    })
}


export const listenWithdrawn=()=>{
   contract.on("withdraw",async( owner ,  token , amount, event)=>{
    try {
        await Payment.findOneAndUpdate(
            {token:token,amount:amount.toString(),withdrawn:false},
            {withdrawn:true}
        );
        console.log(`Withdraw updated:${token} ${amount}`);
        
    } catch (error) {
        console.error("Errow While updating the withdraw ",error.message);
    }
   })
}


export const startAllEventListeners=()=>{
    listenPaymentRecieved();
    listenRefunded();
    listenWithdrawn();
    console.log("Contract listeners Started...");
}


