import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL

if(!redisUrl){
    console.log("Redis url missing")
    process.exit(1)
}
const redisClient = createClient({
    url:redisUrl
})

redisClient.on("error",(err)=>{
    console.log("Redis Error",err)
})

export default redisClient