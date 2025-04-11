import React from "react";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const InitApp = () => {

  return <App/>
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <InitApp />
  </StrictMode>,
)
