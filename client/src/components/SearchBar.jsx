import React, { useState } from 'react'
import {Search} from "lucide-react"
import {getAdminStats} from "../api/contract.js"
import {useQuery, useQueryClient} from "@tanstack/react-query" 
import axios from 'axios'
const SearchBar = () => {
  const [searchAddress,setSearchAddress]=useState("");
  const [clear,setClear]=useState("");
  console.log(searchAddress);
  

  const {data , isLoading , isError}=useQuery({
    queryKey:["searchAddress",searchAddress],
    queryFn:async()=>{
      const res=await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/api/search?address=${searchAddress}`)
      return res.data;
    },
    enabled:searchAddress.length==="30",
    placeholderData:(previousData)=>previousData
  })
  const handleClear=async()=>{
    setClear("")
    setSearchAddress("")
  }
  
  

  return (
    <div className='p-2'>
        <h5 className='text-md text-start mb-2 font-semibold' >Search by Address</h5>
        <input value={searchAddress} onChange={(e)=>setSearchAddress(e.target.value)} type="text" className='rounded-md border px-2 w-full h-10 border-blue-100 focus:outline-none focus:ring-1 bg-blue-50 focus:ring-blue-100' placeholder='0x123456789' />
   
    </div>
  )
}

export default SearchBar