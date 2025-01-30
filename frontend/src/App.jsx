import React from 'react'
import {BrowserRouter, Routes, Route} from  "react-router-dom"

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <BrowserRouter>
    <Routes>
        {/* home */}
        <Route path="/" element={<Home/>} ></Route>
       
        {/* login */}
        <Route path="/login" element={<Login/>}></Route>
        {/* register */}
        <Route path="/register" element={<Register/>}></Route>
        {/* dashboard */}
        <Route path="/dashboard" element={<Dashboard/>}></Route>
    </Routes>
    
    </BrowserRouter>
  )
}

export default App