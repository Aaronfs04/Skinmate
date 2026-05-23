import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import HeroPage from './Pages/HeroPage'
import ScanPage from './Pages/ScanPage'
import HistoryPage from './Pages/HistoryPage'
import Register from './Pages/Register'

function AppRouter() {
  const path = window.location.pathname

  if (path === '/scan' || path === '/app/scan') return <ScanPage />
  if (path === '/history' || path === '/app/history') return <HistoryPage />
  if (path === '/auth/register' || path === '/app/auth/register') return <Register />

  return <HeroPage />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)
