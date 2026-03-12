import express from 'express'
import { login, registerUser, verifyOtp, verifyUser } from '../controllers/user.controller.js'

const router = express.Router()
router.post('/register',registerUser)
router.post('/verify/:token',verifyUser)
router.post('/login',login)
router.post('/verify',verifyOtp)

export default router