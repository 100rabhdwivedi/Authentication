import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
import { AppProvider } from './context/AppContex.jsx'

export const server = "http://localhost:3000"

createRoot(document.getElementById('root')).render(
    <AppProvider>
    <BrowserRouter>
        <App />
    </BrowserRouter>
    </AppProvider>

)
