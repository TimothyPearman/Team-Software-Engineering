import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// render the app to the DOM
createRoot(document.getElementById('root')).render(
  <StrictMode> {/* development only */}
    <App />
  </StrictMode>,
)
