import express from 'express'
import { login, logoutUser, myProfile, refreshToken, registerUser, verifyOtp, verifyUser } from '../controllers/user.controller.js'
import { isAuth } from '../middlewares/isAuth.middleware.js'

const router = express.Router()
router.post('/register',registerUser)
router.post('/verify/:token',verifyUser)
router.post('/login',login)
router.post('/verify',verifyOtp)
router.get('/me',isAuth,myProfile)
router.post('/refresh',refreshToken)
router.post('/logout',isAuth,logoutUser)

export default router