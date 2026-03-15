import express from 'express'
import { login, myProfile, refreshToken, registerUser, verifyOtp, verifyUser } from '../controllers/user.controller.js'
import { isAuth } from '../middlewares/isAuth.middleware.js'

const router = express.Router()
router.post('/register',registerUser)
router.post('/verify/:token',verifyUser)
router.post('/login',login)
router.post('/verify',verifyOtp)
router.get('/me',isAuth,myProfile)
router.post('/refresh',refreshToken)

export default router