import express from "express"
import cors from "cors"
import contractRoute from "./routes/contract.route.js"
import { ethers } from "ethers";
import path from "path";
import fs from "fs"
import Payment from "./models/Payment.js";
import { connectDB } from "./Db/connectDb.js";

const app = express();

app.use(cors())
app.use(express.json())

const abiPath = path.resolve("./Contract.Abi.json");
const abi = JSON.parse(fs.readFileSync(abiPath, "utf8"));
const contractAddress = process.env.CONTRACT_ADDRESS;
const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL)
const contract = new ethers.Contract(contractAddress, abi, provider)






const startServer = async () => {
    try {
        await connectDB();
        console.log("Database connected");
        console.log("Contract Address:", contractAddress);
        const code = await provider.getCode(contractAddress);
        if (code === "0x") {
            console.error("No contract found at address:", contractAddress);
        }
        contract.on("paymentRecieved", async (...args) => {
            try {
                console.log("Event triggered! Args:", args);
                const event = args[args.length - 1];
                const [sender, token, amount, fees, timestamp] = args;
                const txHash = event.log.transactionHash;
                console.log("Transaction Hash:", txHash);

                const existing = await Payment.findOne({ txHash: txHash });
                if (existing) {
                    console.log("Payment already exists:", txHash);
                    return;
                }

                const newPayment = new Payment({
                    customer: sender.toLowerCase(),
                    token: token === ethers.ZeroAddress ? "ETH" : token,
                    amount: ethers.formatUnits(amount, 18),
                    fees: ethers.formatUnits(fees, 18),
                    timestamp: Number(timestamp),
                    txHash: txHash,
                    refunded:false,
                    withdrawn:false
                });

                await newPayment.save();
                console.log("Payment Saved Successfully:", newPayment);
            } catch (error) {
                console.error("Failed to save Payment:", error);
                console.error("Error details:", error.message);
            }
        });

        console.log("Event listener registered for PaymentReceived");

        app.use("/api", contractRoute);

        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });

    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
app.post("/withdraw",async(req ,  res)=>{
    try {
        const{customer  , indices}=req.body;

        if(!indices || !customer )return;

        const tx=await contract.withDrawAll(indices, customer);
        await tx.wait()

        res.json({success:true , txHash:tx.hash})
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error:error.message})
    }
})


startServer();