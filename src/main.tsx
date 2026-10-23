import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './styles/fonts.css'
import { App } from './app/App'
import './styles/global.css'

// The Insights endpoint is supplied by Vercel, not by the local Vite server.
const analyticsEnabled =
  import.meta.env.PROD && !['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {analyticsEnabled && <Analytics mode="production" />}
  </StrictMode>,
)
