import React from 'react'
import {Search} from "lucide-react"
const SearchBar = () => {
  return (
    <div className='p-2'>
        <h5 className='text-md text-start mb-2 font-semibold' >Search by Address</h5>
        <input type="text" className='rounded-md border px-2 w-full h-10 border-blue-100 focus:outline-none focus:ring-1 bg-blue-50 focus:ring-blue-100' placeholder='0x012104' />
   
    </div>
  )
}

export default SearchBar