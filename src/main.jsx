import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { useAuthStore } from './store/authStore.js'

const InitApp = () => {
  const {checkSession} = useAuthStore();

  useEffect(() => {
    checkSession()
  },[])

  return <App/>
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <InitApp />
  </StrictMode>,
)
