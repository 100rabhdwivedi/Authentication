import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { AppProvider } from './context/AppContex.jsx'

export const server = import.meta.env.VITE_BACKEND_URL

createRoot(document.getElementById('root')).render(
    <AppProvider>
    <BrowserRouter>
        <App />
    </BrowserRouter>
    </AppProvider>

)
