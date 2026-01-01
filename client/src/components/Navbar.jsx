import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {ethers} from "ethers"
import { useWallet } from '../context/WalletContext'
import TestPayButton from './Test'
const Navbar = () => {
  const {account,connectWallet}=useWallet()
  return (
    <div className='h-20 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-400  justify-between flex p-4 items-center' >
        <div className="flex h-full items-center gap-5 flex-row">
            {/* <img src="mark.png" className='h-15 ' alt="" /> */}
        <Link to={"/"} className='text-5xl text-zinc-800 font-bold ' >Nex-Pay</Link>     
        </div>
        <div className="flex items-center gap-4 flex-row">
        <Link to={"/dashboard"} className='text-lg font-bold hover:bg-blue-50 rounded-md px-2 py-1 ' >dashboard</Link>  
        <Link to={"/about"} className='text-lg font-bold hover:bg-blue-50 rounded-md px-2 py-1 ' >About</Link>
        <button className='text-white bg-zinc-800 rounded-md p-1' onClick={connectWallet} >{account? `${account.slice(0,5)}...${account.slice(-5)}`:`Connect Wallet`}</button>
        <TestPayButton />
        </div>
    </div>
  )
}

export default Navbar