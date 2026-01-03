import {getAdminStats,getCustomerPayment,withdrawSingle,batchWithdrawl, availblePayment, searchData} from "../controllers/contract.controller.js"

import express from "express"
const router=express.Router()


router.get("/adminstats",getAdminStats)
router.get("/customerpayment/:address",getCustomerPayment);
router.post("/single/withdrawl",withdrawSingle);
router.post("/batch/withdrawl",batchWithdrawl);
router.get("/available",availblePayment);
router.get("/search",searchData);

export default router;

