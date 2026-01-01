import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import {QueryClient,QueryClientProvider} from "@tanstack/react-query"
import './index.css'
import { WalletProvider } from './context/WalletContext.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import MainLayout from './Layout/mainLayout.jsx'
import Contact from './pages/contact.jsx'
import Dashboard from './pages/dashboard.jsx'

const queryClient=new QueryClient()

const router=createBrowserRouter([
  {
    path:"/",element:<MainLayout/>,
    children:[
      {path:"/",element:<Home/>},
      {path:"/about",element:<About/>},
      {path:"/contact",element:<Contact/>},
      {path:"/dashboard",element:<Dashboard/>},

    ]
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
      <WalletProvider >
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}/>
    </QueryClientProvider >
      </WalletProvider >
  </StrictMode>
)
