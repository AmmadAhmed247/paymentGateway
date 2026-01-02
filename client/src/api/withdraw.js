import axios from "axios"


const BACKEND_URL=import.meta.env.VITE_APP_BACKEND_URL
export const fetchAvailableWithdrawls=async()=>{
    const{data}=await axios.get(`${BACKEND_URL}/api/available`)
    return data;
}

export const withdrawSingle=async()=>{
    const {data}=await axios.post(`${BACKEND_URL}/api/single/withdrawl`,{
        customer , index
    })
    return data;
}


export const batchWithdrawls=async()=>{
    const{data}=await axios.post(`${BACKEND_URL}/api/batch/withdrawl`,{
        customer , index
    })
    return data

}

