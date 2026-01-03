import mongoose from "mongoose"

const PaymentSchema=new mongoose.Schema({
    customer:{type:String, required:true},
    index: { type: Number, required: true },
    token:{type:String,required:true},
    amount:{type:String , required:true},
    fees:{type:String , required:true},
    timestamp:{type:Number, required:true},
    unlockAt:{type:Number ,required:true},
    refunded:{type:Boolean ,required:false},
    withdrawn:{type:Boolean , required:false},
    txHash:{type:String ,required:true ,unique:true },
    blockNumber:{type:Number, required:true}
})

export default mongoose.model("Payment",PaymentSchema);