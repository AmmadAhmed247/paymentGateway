import express from "express"
import cors from "cors"
import contractRoute from "./routes/contract.route.js"
import {startAllEventListeners} from "./controllers/contract.listeners.controller.js"
import {connectDB} from "./Db/connectDb.js"
const app = express();

app.use(cors())
app.use(express.json())

app.use("/api", contractRoute);
app.post("/withdraw",async(req ,  res)=>{
    try {
        const{customer, indices}=req.body;
        if(!indices || !customer )return;
        const tx=await contract.withDrawAll(indices, customer);
        await tx.wait()

        res.json({success:true , txHash:tx.hash})
    } catch (error) {
        console.error(error.message);
        res.status(500).json({error:error.message})
    }
})
startAllEventListeners()
app.listen(3000, () => {
    console.log("Server is running on port 3000");
    connectDB();
});

