import express from 'express'
import { adminController, login, logoutUser, myProfile, refreshToken, registerUser, verifyOtp, verifyUser } from '../controllers/user.controller.js'
import { authorizedAdmin, isAuth } from '../middlewares/isAuth.middleware.js'
import { refreshCSRFToken, verifyCSRFToken } from '../middlewares/csrfMiddleware.js'

const router = express.Router()
router.post('/register',registerUser)
router.post('/verify/:token',verifyUser)
router.post('/login',login)
router.post('/verify',verifyOtp)
router.get('/me',isAuth,myProfile)
router.post('/refresh',refreshToken)
router.post('/logout',isAuth, verifyCSRFToken ,logoutUser)
router.post('/refresh-csrf',isAuth,refreshCSRFToken)
router.get('/admin',isAuth,authorizedAdmin,adminController)

export default router