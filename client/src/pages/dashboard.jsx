import React, { useEffect, useState } from 'react'
import SearchBar from '../components/SearchBar.jsx';
import { Wallet, DollarSign, BarChart2, BadgeDollarSign, Lock } from 'lucide-react';
import Withdraw from '../components/withdraw.jsx';
import { useWallet } from '../context/WalletContext.jsx';
import { getAdminStats, getCustomerPayment } from '../api/contract.js';
import { ethers } from "ethers"
// total revenue ,  fees , available to  withdrawl , total in escrow , 

const dashboard = () => {
  let labels = [...Array(4)];
  const { account } = useWallet();
  const [payment, setPayment] = useState([])
  const [stats, setStats] = useState({ totalEscrow: 0, totalFees: 0, totalPayment: 0, availableToWithdraw: 0 });
  // console.log(stats);
  useEffect(() => {
    if (!account) return
    const loadPayment = async () => {
      const data = await getCustomerPayment(account)
      setPayment(data.data || []);
    }
    const loadStats = async () => {
      const data = await getAdminStats()
      setStats(data);
    }
    loadPayment()
    loadStats()
  }, [account]);



  const [active, setActive] = useState("Overview");
  return (
    <div className='flex  flex-col h-screen p-4 '>
      <div className="mt-2"></div>
      <h1 className='text-5xl  w-fit   p-2 font-roboto   font-bold' >Admin Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 md:grid-cols-2 gap-4  ">
        <div className="h-fit w-full p-2 flex n  flex-col bg-white border border-zinc-300  mt-10 rounded-md">
          <div className="flex border-b  border-zinc-300 flex-row justify-between ">
            <h1 className='text-xl font-semibold py-1 px-2' >Total Payments</h1>
            <Wallet className='h-7  text-blue-400 w-7' />
          </div>
          <div className="flex mt-2  flex-row items-center ">
            <span className='text-6xl font-semibold text-left ' >{ethers.formatEther(stats.totalPayment)} </span>
            <DollarSign className='font-semibold ' />
          </div>
        </div>
        <div className="h-fit w-full p-2 flex n  flex-col bg- border border-zinc-300 mt-10 rounded-md">
          <div className="flex border-b  border-zinc-300 flex-row justify-between ">
            <h1 className='text-xl font-semibold py-1 px-2' >Escrow </h1>
            <Lock className='h-7  text-blue-400 w-7' />
          </div>
          <div className="flex mt-2  flex-row items-center ">
            <span className='text-6xl font-semibold text-left ' >{ethers.formatEther(stats.totalEscrow)} </span>
            <DollarSign className='font-semibold ' />
          </div>
        </div>
        <div className="h-fit w-full p-2 flex n  flex-col border border-zinc-300 bg-white mt-10 rounded-md">
          <div className="flex border-b  border-zinc-300 flex-row justify-between ">
            <h1 className='text-xl font-semibold py-1 px-2' >Available Payments</h1>
            <BadgeDollarSign className='h-7  text-blue-400 w-7' />
          </div>
          <div className="flex mt-2  flex-row items-center ">
            <span className='text-6xl font-semibold text-left ' >{ethers.formatEther(stats.availableToWithdraw)} </span>
            <DollarSign className='font-semibold ' />
          </div>
        </div>
        <div className="h-fit w-full p-2 flex n  flex-col border border-zinc-300 bg-white mt-10 rounded-md">
          <div className="flex border-b  border-zinc-300 flex-row justify-between ">
            <h1 className='text-xl font-semibold py-1 px-2' >Total Fees</h1>
            <BarChart2 className='h-7  text-blue-400 w-7' />
          </div>
          <div className="flex mt-2  flex-row items-center ">
            <span className='text-6xl font-semibold text-left ' >{ethers.formatEther(stats.totalFees)} </span>
            <DollarSign className='font-semibold ' />
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
            {payment.length === 0 ? (
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