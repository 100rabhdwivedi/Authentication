import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import {ToastContainer} from 'react-toastify'
import VerifyOtp from './pages/VerifyOtp'
import Dashboard from './pages/DashBoard'
import { AppData } from './context/AppContex'
import Loading from './pages/Loading'
import Verify from './pages/Verify'
const App = () => {
  const {isAuth,loading} = AppData()
  return (
    <>
    {loading?<Loading/> :
    <>
      <Routes>
      <Route path='/' element={isAuth? <Home /> :<Login/>} />
      <Route path='/login' element={isAuth? <Home /> :<Login/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/verifyotp' element={!isAuth ? <VerifyOtp/> : <Home />} />
      <Route path='/token/:token' element={!isAuth ? <Verify/> : <Home />} />
      <Route path='/dashboard' element={isAuth ? <Dashboard/> : <Login />} />
    </Routes>
    <ToastContainer/>
    </>
    }
    </>
  )
}

export default App