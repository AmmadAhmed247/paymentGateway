import {ethers} from "ethers"
import fs from "fs"
import path from "path";
import dotenv from "dotenv"
import Payment from "../models/Payment.js";
dotenv.config()
const abiPath = path.resolve("./Contract.Abi.json"); 
const abi = JSON.parse(fs.readFileSync(abiPath, "utf8"));
const CONTRACT_ADDRESS="0x33C487e1B20E3870458738c78eaECF7f833f7f19"
const provider=new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const contract=new ethers.Contract(CONTRACT_ADDRESS,abi,provider)
const ESCROW_TIME=24*60*60;
// ruct Payment{
//     address token;
//     uint256 amount;
//     uint256 fees;
//     uint256 timestamp;
//     bool refunded;
//     bool withdrawn;

export const getCustomerPayment=async(req , res)=>{
    try {
    const payments = await Payment.find({}).sort({ timestamp: -1 });

    res.json({
      success: true,
      data: payments.map((p) => ({
        customer: p.customer,
        token: p.token,
        amount: p.amount,
        fees: p.fees,
        timestamp: p.timestamp,
        refunded: p.refunded || false,
        withdrawn: p.withdrawn || false,
        txHash: p.txHash,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export const getAdminStats=async(req , res)=>{
    try {
        const allPayment=await Payment.find({});

        let totalPayment=0
        let totalFees=0
        let totalEscrow=0
        let availableToWithdraw=0

        const now=Math.floor(Date.now()/1000);

        allPayment.forEach((p)=>{
            totalPayment+=parseFloat(p.amount)
            totalFees+=parseFloat(p.fees)

            if(!p.withdrawn && !p.refunded){
                totalEscrow+=parseFloat(p.amount)+parseFloat(p.fees)
            }

            if(p.timestamp+24*60*60<=now){
                availableToWithdraw+=parseFloat(p.amount)+parseFloat(p.fees);
            }
        })
        res.json({
            success:true, 
            totalEscrow,
            totalFees,
            totalPayment,
            availableToWithdraw
        })

    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

export const withdrawSingle=async(req , res)=>{
  try {
    const {indices,customer}=req.body;
    if(!customer || !indices){
      return;
    }
    const tx=await contract.WithDraw(customer , indices);
    await tx.wait()
    res.json({
      success:true,
      txHash:tx.hash
    })

  } catch (error) {
    res.json({
      success:false,
      error:error.message
    })
  }
}

export const batchWithdrawl=async(req ,  res)=>{
  try {
    const{customer , indices}=req.body
    if(!customer || !indices){
      return ;
    }

    const tx=await contract.withDrawAll(indices,customer)
    await tx.wait()
    res.json({
      sucess:true,
      txHash:tx.hash
    })
  } catch (error) {
    res.json({
      error:error.message,
      sucess:false
    })
  }
}

export const availblePayment=async(req , res)=>{
  try {
    const now=Math.floor(Date.now()/1000);
    const availPayments=await Payment.find({
      refunded:false, 
      withdrawn:false,
      timestamp:{$lte:now-ESCROW_TIME}
    })
    const formatted=availPayments.map(p=>({
      customer:p.customer,
      index:p.index,
      token:p.token,
      amount:p.amount, 
      fees:p.fees,
      symbol:p.token==="0x0"?"ETH":p.token
    }))
    res.json(formatted)
  } catch (error) {
    res.status(500).json({error:error.message})
  }
}