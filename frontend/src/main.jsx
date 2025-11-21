import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'  // import เพิ่ม

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>  {/* ครอบ App ด้วย BrowserRouter */}
      <App />
    </BrowserRouter>
  </StrictMode>,
)
