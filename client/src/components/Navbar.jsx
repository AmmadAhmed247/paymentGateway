import React from 'react'
import { Link } from 'react-router-dom'
const Navbar = () => {
  return (
    <div className='h-20 bg-blue-100 justify-between flex p-4 items-center' >
        <div className="flex h-full items-center gap-5 flex-row">
            {/* <img src="mark.png" className='h-15 ' alt="" /> */}
        <Link to={"/"} className='text-5xl text-zinc-800 font-bold ' >Nex-Pay</Link>     
        </div>
        <div className="flex items-center flex-row">
        <Link to={"/dashboard"} className='text-lg font-bold hover:bg-blue-50 rounded-md px-2 py-1 ' >dashboard</Link>  
        <Link to={"/about"} className='text-lg font-bold hover:bg-blue-50 rounded-md px-2 py-1 ' >About</Link>
        </div>
    </div>
  )
}

export default Navbar