import React, { useEffect, useState } from 'react'
import { SiEthereum } from 'react-icons/si';
import SearchBar from '../components/SearchBar.jsx';
import { Wallet, DollarSign, BarChart2, BadgeDollarSign, Lock  } from 'lucide-react';
import Withdraw from '../components/withdraw.jsx';
import { useWallet } from '../context/WalletContext.jsx';
import { getAdminStats, getCustomerPayment } from '../api/contract.js';
import { ethers  } from "ethers"
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
// total revenue ,  fees , available to  withdrawl , total in escrow , 
const formatEth = (value) => {
  if (!value) return "0";
  try {
    return ethers.formatEther(value.toString());
  } catch (err) {
    console.error("formatEth error:", err, value);
    return "0";
  }
};



const dashboard = () => {
  const { account } = useWallet();
  const[select,setSelect]=useState("ETH")
  console.log(select);
  

  const {data:stats }=useQuery({
    queryKey:["admin-stats"],
    queryFn:getAdminStats,
    staleTime:1000,
  })
  const{data:paymentsData}=useQuery({
    queryKey:["payments",account],
    queryFn:getCustomerPayment,
    enabled:!!account
  })
  const payment = paymentsData?.data || [];

  const [active, setActive] = useState("Overview");
  return (
    <div className='flex  flex-col h-screen p-4 '>
      <div className="mt-2"></div>
      <h1 className='text-5xl  w-fit   p-2 mb-10 font-roboto   font-bold' >Admin Dashboard</h1>
      <div className="flex mt-2 p-2 absolute  rounded-2xl w-fit gap-2 flex-row  ">
      <button onClick={()=>setSelect("usd")} className='px-2 top-22 right-1 relative py-1 text-xl bg-blue-200 rounded-2xl' >USD</button>
      <button onClick={()=>setSelect("eth")} className='px-2 top-22 right-1 relative py-1 text-xl bg-blue-200 rounded-2xl' >ETH</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 md:grid-cols-2 gap-4  ">
        <div className="h-fit w-full p-2 flex n  flex-col bg-white border border-zinc-300  mt-10 rounded-md">
          <div className="flex border-b  border-zinc-300 flex-row justify-between ">
            <h1 className='text-xl font-semibold py-1 px-2' >Total Payments</h1>
            <Wallet className='h-7  text-blue-400 w-7' />
          </div>
          <div className="flex mt-2  flex-row items-center ">
            <span className='text-6xl font-semibold text-left ' >{formatEth(stats?.totalPayment)} </span>
            <SiEthereum className="w-12 h-12 text-blue-500" />

          </div>
        </div>
        <div className="h-fit w-full p-2 flex n  flex-col bg- border border-zinc-300 mt-10 rounded-md">
          <div className="flex border-b  border-zinc-300 flex-row justify-between ">
            <h1 className='text-xl font-semibold py-1 px-2' >Escrow </h1>
            <Lock className='h-7  text-blue-400 w-7' />
          </div>
          <div className="flex mt-2  flex-row items-center ">
            <span className='text-6xl font-semibold text-left ' >{formatEth(stats?.totalEscrow)} </span>
            <SiEthereum className="w-12 h-12 text-blue-500" />
          </div>
        </div>
        <div className="h-fit w-full p-2 flex n  flex-col border border-zinc-300 bg-white mt-10 rounded-md">
          <div className="flex border-b  border-zinc-300 flex-row justify-between ">
            <h1 className='text-xl font-semibold py-1 px-2' >Available Payments</h1>
            <BadgeDollarSign className='h-7  text-blue-400 w-7' />
          </div>
          <div className="flex mt-2  flex-row items-center ">
            <span className='text-6xl font-semibold text-left ' >{formatEth(stats?.availableToWithdraw)} </span>
            <SiEthereum className="w-12 h-12 text-blue-500" />
          </div>
        </div>
        <div className="h-fit w-full p-2 flex n  flex-col border border-zinc-300 bg-white mt-10 rounded-md">
          <div className="flex border-b  border-zinc-300 flex-row justify-between ">
            <h1 className='text-xl font-semibold py-1 px-2' >Total Fees</h1>
            <BarChart2 className='h-7  text-blue-400 w-7' />
          </div>
          <div className="flex mt-2  flex-row items-center ">
            <span className='text-6xl font-semibold text-left ' >{formatEth(stats?.totalFees)} </span>
            <SiEthereum className="w-12 h-12 text-blue-500" />
          </div>
        </div>
      </div>
      <div className="flex mt-4 border rounded-md border-blue-100 flex-col">
        <div className="flex border-b border-blue-100 mb-2 py-2 gap-4">
          <button onClick={() => setActive("Overview")} className={`text-left px-2 ${active == "Overview" ? "text-blue-500 border-b-2" : "text-black"} font-semibold mt-2 `}  >Overview</button>
          <button onClick={() => setActive("Withdrawls")} className={`text-left px-2 ${active == "Withdrawls" ? "text-blue-500 border-b-2" : "text-black"} font-semibold mt-2 `}  >Withdrawls</button>
        </div>
        <SearchBar />
        {active === "Overview" ? (<table>
          <thead className='w-full  ' >
            <tr>
              <th className='p-3 text-left ' >Customer</th>
              <th className='p-3 text-left ' >Token </th>
              <th className='p-3 text-left ' >Amount</th>
              <th className='p-3 text-left ' >Fees</th>
              <th className='p-3 text-left whitespace-nowrap ' >Transaction</th>
              <th className='p-3 text-left whitespace-nowrap ' >Unlock Time</th>
              <th className='p-3 text-left ' >Status</th>
            </tr>
          </thead>
          <tbody className='border-t border-zinc-700' >
            {payment?.length === 0 ? (
              <tr>
                <td colSpan={6} className='p-3 text-center'>No payments found</td>
              </tr>
            ) : (
              payment.map((p, index) => (
                <tr className='border-b-2   border-blue-50' >
                  <td className='p-3' >{account}</td>
                  <td className='p-3 text-left text-white' ><span className={` px-2 py-1 rounded-md ${p.token == "ETH" ? "bg-blue-400" : "bg-green-400"} inline-block`} >{p.token}</span></td>
                  <td className='p-3' >{ethers.formatEther(p.amount)}</td>
                  <td className='p-3' >{ethers.formatEther(p.fees)}</td>
                  <td className='p-3' >{new Date(p.timestamp * 1000).toLocaleString()}</td>
                  <td className='p-3'>
                    {p.unlockAt
                      ? new Date(Number(p.unlockAt) * 1000).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className='p-3' ><span className={` text-white  px-2 py-1 rounded-md ${p.refunded ? "bg-red-300" : p.withdrawn ? "bg-orange-400" : "bg-green-400"}`} >{p.refunded ? "Refunded" : p.withdrawn ? "Withdraw" : "Active"}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        ) : (
          <Withdraw />
        )}
      </div>
    </div>
  )
}

export default dashboard