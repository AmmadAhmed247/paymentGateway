import React, { useEffect, useState } from 'react'
import { Search, Loader2, X } from "lucide-react"
import { useQuery, useQueryClient } from "@tanstack/react-query" 
import axios from 'axios'
import {ethers} from "ethers"
const SearchBar = () => {
  const [searchAddress, setSearchAddress] = useState('')
  const [debouncedAddress, setDebouncedAddress] = useState('')

 useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAddress(searchAddress)
    }, 500) 
    return () => clearTimeout(timer)
  }, [searchAddress])

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["searchAddress", debouncedAddress],
    queryFn: async () => {
      if (!debouncedAddress || debouncedAddress.length < 10) {
        return null
      }
      const res = await axios.get(
        `${import.meta.env.VITE_APP_BACKEND_URL}/api/search?address=${debouncedAddress}`
      )
      return res.data
    },
    enabled: !!debouncedAddress && debouncedAddress.length >= 10, 
    retry: 1,
  })

  const handleClear = () => {
    setSearchAddress('')
    setDebouncedAddress('')
  }

  return (
    <div className='p-2'>
      <h5 className='text-md text-start mb-2 font-semibold'>Search by Address</h5>
      
   
      <div className='relative'>
        <input 
          value={searchAddress} 
          onChange={(e) => setSearchAddress(e.target.value)} 
          type="text" 
          className='rounded-md border px-10 w-full h-10 border-blue-100 focus:outline-none focus:ring-2 bg-blue-50 focus:ring-blue-300' 
          placeholder='0x123456789...' 
        />

        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5' />

        {isLoading && debouncedAddress ? (
          <Loader2 className='absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5 animate-spin' />
        ) : searchAddress ? (
          <button 
            onClick={handleClear}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
          >
            <X className='w-5 h-5' />
          </button>
        ) : null}
      </div>
      {debouncedAddress && debouncedAddress.length >= 10 && (
        <div className='mt-4'>
          {isLoading && (
            <div className='text-center py-4 text-blue-600'>
              <Loader2 className='w-6 h-6 animate-spin mx-auto mb-2' />
              Searching...
            </div>
          )}
          {isError && (
            <div className='bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-md'>
              Error: {error?.response?.data?.message || error?.message || 'Failed to search'}
            </div>
          )}
          {!isLoading && !isError && data && (
            <div className='bg-white border border-blue-200 rounded-md p-4 shadow-sm'>
              {data.payments && data.payments.length > 0 ? (
                <div>
                  <h6 className='font-semibold text-blue-950 mb-3'>
                    Found {data.payments.length} payment(s)
                  </h6>
                  <div className='space-y-2'>
                    {data.payments.map((payment, index) => (
                      <div key={index} className='border-b border-blue-100 pb-2 last:border-b-0'>
                        <div className='flex justify-between items-center'>
                          <span className='text-sm font-semibold text-zinc-900'>Amount:</span>
                          <span className='font-semibold text-blue-950'>
                            {ethers.formatEther(payment.amount)} {payment.token}
                          </span>
                        </div>
                        <div className='flex justify-between items-center'>
                          <span className='text-sm font-semibold text-gray-600'>Status:</span>
                          <span className={`text-sm  font-bold ${
                            payment.withdrawn ? 'text-green-500 border-b-2 ' : 
                            payment.refunded ? 'text-red-600' : 
                            'text-green-500'
                          }`}>
                            {payment.withdrawn ? 'Withdrawn' : 
                             payment.refunded ? 'Refunded' : 
                             'Available'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className='text-gray-600 text-center'>No payments found for this address</p>
              )}
            </div>
          )}

          {!isLoading && !isError && !data && debouncedAddress.length < 10 && (
            <div className='text-gray-500 text-sm mt-2'>
              Please enter a valid Ethereum address (at least 10 characters)
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar