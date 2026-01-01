import axios from "axios"
const BACKEND_URL=import.meta.env.VITE_APP_BACKEND_URL;



export const getCustomerPayment=async(address)=>{
    const res=await axios.get(`${BACKEND_URL}/api/customerpayment/${address}`)
    return res.data;
}

export const getAdminStats=async()=>{
    const res=await axios.get(`${BACKEND_URL}/api/adminstats`)
    return res.data;
}


