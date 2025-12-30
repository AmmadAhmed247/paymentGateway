import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ParticlesBackground from '../components/particleBackground'
const mainLayout = () => {
  return (
    <div>
        <Navbar />
        {/* <ParticlesBackground /> */}
        <Outlet />
    </div>
  )
}

export default mainLayout