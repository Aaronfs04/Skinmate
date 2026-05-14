import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import  HeroPage from './Pages/HeroPage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HeroPage />
  </StrictMode>,
)
