import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import '../assets/scss/index.scss'
import ThemeManager from './ThemeManager'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeManager>
      <App />
    </ThemeManager>
  </React.StrictMode>
)
