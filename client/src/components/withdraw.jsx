import React, { useState } from 'react'
import { Clock, AlertCircle, Loader2 } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const Withdraw = () => {
  const [selected, setSelected] = useState([])
  const [processingIds, setProcessingIds] = useState([])
  const queryClient = useQueryClient()

  const API = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:3000'

  
  const { 
    data: withdrawals = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['withdrawals'],
    queryFn: async () => {
      const response = await axios.get(`${API}/api/available`)
      return response.data
    },
    refetchOnWindowFocus: false,
  })

  const singleWithdrawMutation = useMutation({
    mutationFn: async ({ customer, index }) => {
      const response = await axios.post(`${API}/api/single/withdrawl`, {
        customer,
        index
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['withdrawals'])
      alert('Withdrawal successful!')
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Withdrawal failed')
      console.error('Error processing withdrawal:', error)
    }
  })

  
  const batchWithdrawMutation = useMutation({
    mutationFn: async (withdrawals) => {
      const response = await axios.post(`${API}/api/batch/withdrawl`, {
        withdrawals
      })
      return response.data
    },
    onSuccess: () => {
      setSelected([])
      queryClient.invalidateQueries(['withdrawals'])
      alert('Batch withdrawal successful!')
    },
    onError: (error) => {
      alert(error.response?.data?.message || 'Batch withdrawal failed')
      console.error('Error processing batch withdrawal:', error)
    }
  })

  const handleWithdraw = async (customer, index) => {
    setProcessingIds(prev => [...prev, index])
    try {
      await singleWithdrawMutation.mutateAsync({ customer, index })
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== index))
    }
  }

  
  const handleBatchWithdraw = () => {
    if (selected.length === 0) {
      alert('Please select at least one withdrawal')
      return
    }
    batchWithdrawMutation.mutate(selected)
  }

  
  const toggleSelect = (withdrawal, index) => {
    setSelected(prev => {
      const exists = prev.find(item => item.index === index)
      if (exists) {
        return prev.filter(item => item.index !== index)
      } else {
        return [...prev, { customer: withdrawal.customer, index }]
      }
    })
  }


  const isSelected = (index) => {
    return selected.some(item => item.index === index)
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-6 flex-col">
          {/* Header Section */}
          <div className="flex mb-4 flex-row justify-between items-center">
            <h1 className='text-4xl font-bold text-blue-950'>Available Withdrawals</h1>
            <button 
              onClick={handleBatchWithdraw}
              disabled={selected.length === 0 || batchWithdrawMutation.isPending}
              className='bg-gradient-to-r from-green-500 to-green-400 text-white font-semibold rounded-xl px-8 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2'
            >
              {batchWithdrawMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                `Batch Withdraw (${selected.length})`
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error.response?.data?.message || error.message || 'Failed to fetch withdrawals'}</span>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="bg-white rounded-2xl p-12 shadow-lg border border-blue-200 text-center">
              <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-blue-600">Loading withdrawals...</p>
            </div>
          )}

          {/* Withdrawal Cards */}
          {!isLoading && withdrawals.length > 0 && (
            <div className="space-y-4">
              {withdrawals.map((withdrawal, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-center justify-between gap-6">
                    <input 
                      type="checkbox" 
                      checked={isSelected(index)}
                      onChange={() => toggleSelect(withdrawal, index)}
                      className='w-6 h-6 text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer' 
                    />
                    
                    <div className="flex-1 grid grid-cols-3 gap-6">
                      <div className="flex flex-col">
                        <span className='text-sm text-blue-600 font-medium mb-2'>Customer</span>
                        <h6 className='text-base font-semibold text-blue-950'>
                          {withdrawal.customer || 'N/A'}
                        </h6>
                      </div>
                      
                      <div className="flex flex-col">
                        <span className='text-sm text-blue-600 font-medium mb-2'>Amount + Fees</span>
                        <span className='text-xl font-bold text-blue-950'>
                          {withdrawal.amount || '0'} 
                          <span className='text-sm font-medium text-blue-600 ml-1'>
                            {withdrawal.currency || 'ETH'}
                          </span>
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
                      onClick={() => handleWithdraw(withdrawal.customer, index)}
                      disabled={processingIds.includes(index)}
                      className='bg-gradient-to-r from-blue-300 to-blue-400 rounded-xl px-6 py-3 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2'
                    >
                      {processingIds.includes(index) ? (
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
            </div>
          )}

          {/* Empty State */}
          {!isLoading && withdrawals.length === 0 && !error && (
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
  )
}

export default Withdraw