import express from 'express'
import userRoutes from './routes/user.route.js'
import cookieParser from 'cookie-parser'
const app = express()
app.use(express.json())
app.use(cookieParser())
//using routes
app.use('/api/v1',userRoutes)


export default app