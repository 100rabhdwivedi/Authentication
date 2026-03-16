import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import {ToastContainer} from 'react-toastify'
import VerifyOtp from './pages/VerifyOtp'
import Dashboard from './pages/DashBoard'
const App = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register/>} />
      <Route path='/verifyotp' element={<VerifyOtp/>} />
      <Route path='/dashboard' element={<Dashboard/>} />

    </Routes>
    <ToastContainer/>
    </>
  )
}

export default App