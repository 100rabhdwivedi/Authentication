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
import ProtectedRoutes from './components/ProtectedRoutes'
const App = () => {
  const {isAuth,loading} = AppData()  
  
  return (
    <>
    {loading?<Loading/> :
    <>
      <Routes>
      <Route path='/' element={<ProtectedRoutes> <Home/> </ProtectedRoutes>} />
      <Route path='/login' element={!isAuth? <Login /> :<Home/>} />
      <Route path='/register' element={!isAuth ? <Register/> : <Home/>} />
      <Route path='/verifyotp' element={!isAuth ? <VerifyOtp/> : <Home />} />
      <Route path='/token/:token' element={isAuth ? <Home /> :   <Verify/>} />
      <Route path='/dashboard' element={<ProtectedRoutes> <Dashboard/> </ProtectedRoutes> } />
    </Routes>
    <ToastContainer/>
    </>
    }
    </>
  )
}

export default App