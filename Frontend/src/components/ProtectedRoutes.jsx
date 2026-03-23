import React, { useEffect } from 'react'
import { AppData } from '../context/AppContex'
import { useNavigate } from 'react-router-dom'

const ProtectedRoutes = ({ children }) => {
    const { isAuth } = AppData()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuth) {
            navigate("/login")
        }
    }, [isAuth, navigate])

    return isAuth ? children : null
}

export default ProtectedRoutes