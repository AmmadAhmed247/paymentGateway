import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ParticlesBackground from '../components/particleBackground.jsx'
const Home = () => {
  const [isVisible, setIsVisible] = useState(false)
  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-100 via-blue-100 to-blue-200 flex items-center justify-center px-4 relative overflow-hidden'>
      {/* <div className='absolute inset-0 overflow-hidden'>
      </div> */}
        <ParticlesBackground />
      <div className='absolute inset-0 opacity-5'>
        <div className='w-full h-full' style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className='relative z-10 text-center max-w-6xl mx-auto'>
        <div className={`inline-flex items-center px-4 py-2 bg-zinc-800 backdrop-blur-sm border border-blue-400/30 rounded-full mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <span className='text-blue-100 text-sm font-medium'>Blockchain Powered Payment</span>
        </div>

        <h1 className={`text-7xl  hover:scale-140 md:text-8xl lg:text-9xl font-bold mb-6 transition-all duration-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className='text-white drop-shadow-2xl'>
            A Crypto Pay
          </span>
        </h1>

        <div className={`mb-6 transition-all hover:scale-140  duration-800 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className='text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2'>
            Enjoy{' '}
            <span className='relative inline-block'>
              <span className=' z-10'>
                0% fees
              </span>
            </span>
          </h2>
        </div>

        <h2 className={`text-5xl  hover:scale-150 md:text-6xl transition-all duration-800 delay-300 lg:text-7xl ${isVisible ? 'opacity-100 translate-y-0':'opacity-0 translate-y-8'} font-bold text-white mb-12`}>
          on Chain
        </h2>

        <div className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-800 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <button className='group relative px-8 py-4 bg-white text-blue-950 rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/10'>
            <Link to={"/contact"} className='relative z-10'>Get Started</Link>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home