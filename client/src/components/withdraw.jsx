import React from 'react'
import { Clock } from 'lucide-react'
import { useState } from 'react'
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import { withdrawSingle , batchWithdrawls , fetchAvailableWithdrawls} from '../api/withdraw.js'
const Withdraw = () => {
  const [selected,setSelected]=useState([])
  const queryClient=useQueryClient()
  const{data:payments=[],isLoading}=useQuery({
    queryKey:["available-withdrawls"],
    queryFn:fetchAvailableWithdrawls
  });

  const singleMutation=useMutation({
    mutationFn:withdrawSingle,
    onSuccess:()=>{
      queryClient.invalidateQueries(["available-withdrawls"])
    }
  })

  const batchMutation=useMutation({
    mutationFn:batchWithdrawls,
    onSuccess:()=>{
      setSelected([])
      queryClient.invalidateQueries(["available-withdrawls"])
    }
  })

  const toggleSelect=(index)=>{
    setSelected((prev)=>
      prev.includes(index) ? prev.filter((i)=>i!==index):[...prev , index]
    )
  }

  if(isLoading)return <p>Loading....</p>


  return (
    <div className="min-h-screen  p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-6 flex-col">
          
          <div className="flex mb-4 flex-row justify-between items-center">
            <h1 className='text-4xl font-bold text-blue-950'>Available Withdrawals</h1>
            <button disabled={selected.length===0} onClick={()=>batchMutation.mutate({
              customer:payments[0]?.customer,
              indices:selected
            })} className={`${selected.length===0 ? "bg-green-300":"bg-green-500"}  text-white font-semibold rounded-xl px-8 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300`}>
              Batch Withdraw {selected.length}
            </button>
          </div>
          <div className="space-y-4">
            {payments.map((p)=>(      
            <div key={p.index} className="bg-white rounded-2xl p-6 shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between gap-6">
                <input 
                  type="checkbox" 
                  checked={selected.includes(p.index)}
                  onChange={()=>toggleSelect(p.index)}
                  className='w-6 h-6 text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer' 
                />
                
                <div className="flex-1 grid grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    <span className='text-sm text-blue-600 font-medium mb-2'>Customer</span>
                    <h6 className='text-sm font-semibold text-blue-950'>{p.customer.slice(0,14)}.......{p.customer.slice(-14)} </h6>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className='text-sm text-blue-600 font-medium mb-2'>Amount + Fees</span>
                    <span className='text-xl font-bold text-blue-950'>{parseFloat(p.amount)+parseFloat(p.fees)} <span className='text-sm font-medium text-blue-600'>{p.token}</span></span>
                  </div>

                  <div className="flex flex-col">
                    <span className='text-sm text-blue-600 font-medium mb-2'>Escrow Status</span>
                    <span className='inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-semibold w-fit'>
                      Available
                    </span>
                  </div>
                </div>

                <button onClick={()=>{
                  singleMutation.mutate({
                    customer:p.customer,
                    index:p.index
                  })
                }} className='bg-gradient-to-r from-blue-300 to-blue-400 rounded-xl px-6 py-3 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300'>
                  Withdraw
                </button>
              </div>
            </div>
            ))}        
            {payments.length==0 ? (
              <div className="bg-white rounded-2xl p-12 shadow-lg border border-blue-200 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock />
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-2">No Available Withdrawals</h3>
              <p className="text-blue-600">All payments are still in escrow or have been withdrawn</p>
            </div>
            ):null}
         
          </div>
        </div>
      </div>
    </div>
  )
}

export default Withdraw