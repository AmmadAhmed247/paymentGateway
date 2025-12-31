import React, { useState } from 'react'
import SearchBar from '../components/SearchBar.jsx';
import { Wallet ,DollarSign ,BarChart2 ,BadgeDollarSign,Lock } from 'lucide-react';
import Withdraw from '../components/withdraw.jsx';
// total revenue ,  fees , available to  withdrawl , total in escrow , 

const dashboard = () => {
  let labels=[...Array(4)];
  
  const [active,setActive]=useState("Overview");
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
          <span className='text-6xl font-semibold text-left ' >10000 </span>
          <DollarSign className='font-semibold ' />
          </div>
        </div>       
        <div className="h-fit w-full p-2 flex n  flex-col bg- border border-zinc-300 mt-10 rounded-md">
          <div className="flex border-b  border-zinc-300 flex-row justify-between ">
          <h1 className='text-xl font-semibold py-1 px-2' >Escrow </h1>
          <Lock className='h-7  text-blue-400 w-7' />
          </div>
          <div className="flex mt-2  flex-row items-center ">
          <span className='text-6xl font-semibold text-left ' >10000 </span>
          <DollarSign className='font-semibold ' />
          </div>
        </div>       
        <div className="h-fit w-full p-2 flex n  flex-col border border-zinc-300 bg-white mt-10 rounded-md">
          <div className="flex border-b  border-zinc-300 flex-row justify-between ">
          <h1 className='text-xl font-semibold py-1 px-2' >Available Payments</h1>
          <BadgeDollarSign className='h-7  text-blue-400 w-7' />
          </div>
          <div className="flex mt-2  flex-row items-center ">
          <span className='text-6xl font-semibold text-left ' >10000 </span>
          <DollarSign className='font-semibold ' />
          </div>
        </div>       
        <div className="h-fit w-full p-2 flex n  flex-col border border-zinc-300 bg-white mt-10 rounded-md">
          <div className="flex border-b  border-zinc-300 flex-row justify-between ">
          <h1 className='text-xl font-semibold py-1 px-2' >Total Fees</h1>
          <BarChart2 className='h-7  text-blue-400 w-7' />
          </div>
          <div className="flex mt-2  flex-row items-center ">
          <span className='text-6xl font-semibold text-left ' >10000 </span>
          <DollarSign className='font-semibold ' />
          </div>
        </div>       
      </div>
        <div className="flex mt-4 border rounded-md border-blue-100 flex-col">
        <div className="flex border-b border-blue-100 mb-2 py-2 gap-4">
        <button onClick={()=>setActive("Overview")} className={`text-left px-2 ${active=="Overview"? "text-blue-500 border-b-2":"text-black"} font-semibold mt-2 `}  >Overview</button>
        <button onClick={()=>setActive("Withdrawls")} className={`text-left px-2 ${active=="Withdrawls"? "text-blue-500 border-b-2":"text-black"} font-semibold mt-2 `}  >Withdrawls</button>
        </div>
        <SearchBar />
       {active==="Overview" ? ( <table>
        <thead className='w-full  ' >
          <tr>
            <th className='p-3 text-left ' >Customer</th>
            <th className='p-3 text-left ' >Token </th>
            <th className='p-3 text-left ' >Amount</th>
            <th className='p-3 text-left ' >Fees</th>
            <th className='p-3 text-left whitespace-nowrap ' >Escrow Time</th>
            <th className='p-3 text-left ' >Status</th>
          </tr>
        </thead>
        <tbody className='border-t border-zinc-700' >
          <tr>
            <td className='p-3' >001010210201020</td>
            <td className='p-3' >ETH</td>
            <td className='p-3' >222</td>
            <td className='p-3' >2</td>
            <td className='p-3' >4h 12m</td>
            <td className='p-3' >Active</td>
          </tr>
        </tbody>
       </table>
       ):(
         <Withdraw />
       )}
      </div>
    </div>
  )
}

export default dashboard