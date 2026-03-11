import "./src/config/env.js"; 
import app from './src/app.js'
import connectDb from './src/config/db.js'
import redisClient from './src/config/redis.js'

const PORT = process.env.PORT || 6000

await connectDb()

await redisClient.connect()
console.log("Redis connected")

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})