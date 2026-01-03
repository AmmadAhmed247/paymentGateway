import {ethers} from "ethers"
import fs from "fs"
import path from "path";
import dotenv from "dotenv"
import Payment from "../models/Payment.js";

dotenv.config()

const abiPath = path.resolve("./Contract.Abi.json"); 
const abi = JSON.parse(fs.readFileSync(abiPath, "utf8"));
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet)
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const ESCROW_TIME = 24 * 60 * 60;

export const getCustomerPayment = async (req, res) => {
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
        unlockAt:p.unlockAt,
        refunded: p.refunded || false,
        withdrawn: p.withdrawn || false,
        txHash: p.txHash,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

export const getAdminStats = async (req, res) => {
  try {
    const allPayment = await Payment.find({});
    let totalPayment = 0
    let totalFees = 0
    let totalEscrow = 0
    let availableToWithdraw = 0
    const now = Math.floor(Date.now() / 1000);
    
    allPayment.forEach((p) => {
      totalPayment += parseFloat(p.amount)
      totalFees += parseFloat(p.fees)

      if (!p.withdrawn && !p.refunded) {
        totalEscrow += parseFloat(p.amount) + parseFloat(p.fees)
      }
      if (!p.withdrawn && !p.refunded && p.timestamp + 24 * 60 * 60 <= now) {
        availableToWithdraw += parseFloat(p.amount) + parseFloat(p.fees);
      }
    })
    
    res.json({
      success: true, 
      totalEscrow,
      totalFees,
      totalPayment,
      availableToWithdraw
    })

  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export const withdrawSingle = async (req, res) => {
  try {
    const { index, customer } = req.body;
    
    console.log('Withdrawal request received:', { index, customer });
    

    if (!customer || index === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Customer address and index are required'
      });
    }
    const payment = await Payment.findOne({
      customer: customer,
      index: index,
      withdrawn: false,
      refunded: false
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found or already processed'
      });
    }

    const now = Math.floor(Date.now() / 1000);
    if (now <= payment.unlockAt) {
      return res.status(400).json({
        success: false,
        message: 'Escrow period is still active'
      });
    }

    console.log('Calling contract WithDraw...');
    const tx = await contract.WithDraw(customer, index);
    console.log('Transaction sent:', tx.hash);
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt.hash);

    await Payment.findOneAndUpdate(
      { customer: customer, index: index },
      { withdrawn: true }
    );
    res.json({
      success: true,
      message: 'Withdrawal successful',
      txHash: receipt.hash
    });
  } catch (error) {
    console.error('Withdrawal error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      error: error.reason || error.message
    });
  }
}
export const batchWithdrawl = async (req, res) => {
  try {
    const { customer, indices } = req.body;
    console.log('Batch withdrawal request received:', { customer, indices });
    if (!customer || !indices || indices.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Customer address and indices are required'
      });
    }
    const payments = await Payment.find({
      customer: customer,
      index: { $in: indices },
      withdrawn: false,
      refunded: false
    });

    if (payments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No valid payments found'
      });
    }
    const now = Math.floor(Date.now() / 1000);
    const validPayments = payments.filter(p => now > p.unlockAt);
    if (validPayments.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'All selected payments are still in escrow period'
      });
    }
    console.log('Calling contract withDrawAll...');
    const tx = await contract.withDrawAll(indices, customer);
    const receipt = await tx.wait();
    console.log('Transaction confirmed:', receipt.hash);
    await Payment.updateMany(
      {
        customer: customer,
        index: { $in: indices },
        withdrawn: false,
        refunded: false
      },
      { $set: { withdrawn: true } }
    );

    res.json({
      success: true,
      message: 'Batch withdrawal successful',
      txHash: receipt.hash,
      withdrawnCount: validPayments.length
    });

  } catch (error) {
    console.error('Batch withdrawal error:', error);
    
    res.status(500).json({
      success: false,
      message: error.message,
      error: error.message
    });
  }
}

export const availblePayment = async (req, res) => {
  try {
    const now = Math.floor(Date.now() / 1000);
    const availPayments = await Payment.find({
      refunded: false, 
      withdrawn: false,
      timestamp: { $lte: now - ESCROW_TIME }
    });

    const formatted = availPayments.map(p => ({
      customer: p.customer,
      index: p.index,
      token: p.token,
      amount: p.amount, 
      fees: p.fees,
      symbol: p.token === ZERO_ADDRESS ? "ETH" : p.token
    }));
    
    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const searchData=async(req , res)=>{
  try {
    const{address}=req.query;
    if(!address){
      res.status(400).json("Address is required")
    }
    const payments=await Payment.find({
      customer:address
    })
    res.json({payments})
  } catch (error) {
    res.json(error)
  }
}