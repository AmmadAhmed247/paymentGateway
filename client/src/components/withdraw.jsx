import React from 'react'
import { Clock, Loader2, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import { withdrawSingle , batchWithdrawls , fetchAvailableWithdrawls} from '../api/withdraw.js'
import {ethers} from "ethers"
const Withdraw = () => {
  const [selected, setSelected] = useState([])
  const queryClient = useQueryClient()
  
  const { data: payments = [], isLoading, error } = useQuery({
    queryKey: ["available-withdrawls"],
    queryFn: async () => {
      const data = await fetchAvailableWithdrawls()
      return data.map((payment, idx) => ({
        ...payment,
        index: payment.index !== undefined ? payment.index : idx
      }))
    }
  });

  const singleMutation = useMutation({
    mutationFn: withdrawSingle,
    onSuccess: (data) => {
      console.log('Single withdrawal success:', data)
      alert('Withdrawal successful!')
      queryClient.invalidateQueries(["available-withdrawls"])
    },
    onError: (error) => {
      console.error('Single withdrawal error:', error)
      alert(`Error: ${error.response?.data?.message || error.message}`)
    }
  })

  const batchMutation = useMutation({
    mutationFn: batchWithdrawls,
    onSuccess: (data) => {
      console.log('Batch withdrawal success:', data)
      alert('Batch withdrawal successful!')
      setSelected([])
      queryClient.invalidateQueries(["available-withdrawls"])
    },
    onError: (error) => {
      console.error('Batch withdrawal error:', error)
      alert(`Error: ${error.response?.data?.message || error.message}`)
    }
  })

  const toggleSelect = (index) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  const handleBatchWithdraw = () => {
    console.log('Batch withdraw clicked')
    console.log('Selected indices:', selected)
    console.log('Customer:', payments[0]?.customer)
    
    if (selected.length === 0) {
      alert('Please select at least one withdrawal')
      return
    }
    
    if (!payments[0]?.customer) {
      alert('No customer data available')
      return
    }
    
    batchMutation.mutate({
      customer: payments[0].customer,
      indices: selected
    })
  }

  const handleSingleWithdraw = (payment) => {
    console.log('Single withdraw clicked')
    console.log('Payment data:', payment)
    
    singleMutation.mutate({
      customer: payment.customer,
      index: payment.index
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-blue-600">Loading withdrawals...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-6 h-6" />
          <div>
            <p className="font-semibold">Error loading withdrawals</p>
            <p className="text-sm">{error.response?.data?.message || error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-6 flex-col">
          
          <div className="flex mb-4 flex-row justify-between items-center">
            <h1 className='text-4xl font-bold text-blue-950'>Available Withdrawals</h1>
            <button 
              disabled={selected.length === 0 || batchMutation.isPending} 
              onClick={handleBatchWithdraw}
              className={`${
                selected.length === 0 ? "bg-green-300" : "bg-gradient-to-r from-green-500 to-green-400"
              } text-white font-semibold rounded-xl px-8 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2`}
            >
              {batchMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                `Batch Withdraw (${selected.length})`
              )}
            </button>
          </div>

          {(singleMutation.isError || batchMutation.isError) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>
                {singleMutation.error?.response?.data?.message || 
                 batchMutation.error?.response?.data?.message || 
                 'An error occurred'}
              </span>
            </div>
          )}

          <div className="space-y-4">
            {payments.map((p, idx) => (      
              <div key={p.index ?? idx} className="bg-white rounded-2xl p-6 shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between gap-6">
                  <input 
                    type="checkbox" 
                    checked={selected.includes(p.index)}
                    onChange={() => toggleSelect(p.index)}
                    disabled={singleMutation.isPending || batchMutation.isPending}
                    className='w-6 h-6 text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed' 
                  />
                  
                  <div className="flex-1 grid grid-cols-3 gap-6">
                    <div className="flex flex-col">
                      <span className='text-sm text-blue-600 font-medium mb-2'>Customer</span>
                      <h6 className='text-sm font-semibold text-blue-950'>
                        {p.customer.slice(0, 14)}.......{p.customer.slice(-14)}
                      </h6>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className='text-sm text-blue-600 font-medium mb-2'>Amount + Fees</span>
                      <span className='text-xl font-bold text-blue-950'>
                        {ethers.formatEther(Number(p.amount) + Number(p.fees))} 
                        <span className='text-sm font-medium text-blue-600 ml-1'>{p.token}</span>
                      </span>
                    </div>

                    <div className="flex flex-col">
                      <span className='text-sm text-blue-600 font-medium mb-2'>Escrow Status</span>
                      <span className='inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-semibold w-fit'>
                        Available
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleSingleWithdraw(p)}
                    disabled={singleMutation.isPending || batchMutation.isPending}
                    className='bg-gradient-to-r from-blue-300 to-blue-400 rounded-xl px-6 py-3 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2'
                  >
                    {singleMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Processing
                      </>
                    ) : (
                      'Withdraw'
                    )}
                  </button>
                </div>
              </div>
            ))}        
            
            {payments.length === 0 && (
              <div className="bg-white rounded-2xl p-12 shadow-lg border border-blue-200 text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-blue-950 mb-2">No Available Withdrawals</h3>
                <p className="text-blue-600">All payments are still in escrow or have been withdrawn</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Withdraw