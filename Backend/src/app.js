import express from 'express'
import userRoutes from './routes/user.route.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
    methods:["GET","POST","PUT","DELETE","OPTIONS"]
}))
//using routes
app.use('/api/v1',userRoutes)


export default app