import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ColyseusProvider } from './components/ColyseusProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
<React.StrictMode>
    <ColyseusProvider>
      <App />
    </ColyseusProvider>
  </React.StrictMode>,
)
