import express from 'express'
import userRoutes from './routes/user.route.js'

const app = express()
app.use(express.json())
//using routes
app.use('/api/v1',userRoutes)


export default app