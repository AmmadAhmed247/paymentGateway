import React from 'react'
import { Clock } from 'lucide-react'
const Withdraw = () => {
  return (
    <div className="min-h-screen  p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-6 flex-col">
          {/* Header Section */}
          <div className="flex mb-4 flex-row justify-between items-center">
            <h1 className='text-4xl font-bold text-blue-950'>Available Withdrawals</h1>
            <button className='bg-gradient-to-r from-green-500 to-green-400 text-white font-semibold rounded-xl px-8 py-3 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300'>
              Batch Withdraw (0)
            </button>
          </div>

          {/* Withdrawal Cards */}
          <div className="space-y-4">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between gap-6">
                <input 
                  type="checkbox" 
                  className='w-6 h-6 text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer' 
                />
                
                <div className="flex-1 grid grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    <span className='text-sm text-blue-600 font-medium mb-2'>Customer</span>
                    <h6 className='text-base font-semibold text-blue-950'>0x1212...4141</h6>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className='text-sm text-blue-600 font-medium mb-2'>Amount + Fees</span>
                    <span className='text-xl font-bold text-blue-950'>2,200 <span className='text-sm font-medium text-blue-600'>ETH</span></span>
                  </div>

                  <div className="flex flex-col">
                    <span className='text-sm text-blue-600 font-medium mb-2'>Escrow Status</span>
                    <span className='inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-semibold w-fit'>
                      Available
                    </span>
                  </div>
                </div>

                <button className='bg-gradient-to-r from-blue-300 to-blue-400 rounded-xl px-6 py-3 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300'>
                  Withdraw
                </button>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between gap-6">
                <input 
                  type="checkbox" 
                  className='w-6 h-6 text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 cursor-pointer' 
                />
                
                <div className="flex-1 grid grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    <span className='text-sm text-blue-600 font-medium mb-2'>Customer</span>
                    <h6 className='text-base font-semibold text-blue-950'>0x8a3f...9b2c</h6>
                  </div>
                  
                  <div className="flex flex-col">
                    <span className='text-sm text-blue-600 font-medium mb-2'>Amount + Fees</span>
                    <span className='text-xl font-bold text-blue-950'>5,450 <span className='text-sm font-medium text-blue-600'>USDC</span></span>
                  </div>

                  <div className="flex flex-col">
                    <span className='text-sm text-blue-600 font-medium mb-2'>Escrow Status</span>
                    <span className='inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-semibold w-fit'>
                    Available
                    </span>
                  </div>
                </div>

                <button className='bg-gradient-to-r from-blue-300 to-blue-400 rounded-xl px-6 py-3 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300'>
                  Withdraw
                </button>
              </div>
            </div>

            

            {/* Empty State (if no withdrawals) */}
            {/* <div className="bg-white rounded-2xl p-12 shadow-lg border border-blue-200 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock />
              </div>
              <h3 className="text-xl font-bold text-blue-950 mb-2">No Available Withdrawals</h3>
              <p className="text-blue-600">All payments are still in escrow or have been withdrawn</p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Withdraw