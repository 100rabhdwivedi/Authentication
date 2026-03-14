import jwt from 'jsonwebtoken'
import TryCatch from './TryCatch.middleware'
import redisClient from '../config/redis';
import { User } from '../models/user.model';

export const isAuth = TryCatch(async(req,res,next)=>{
    const token = req.cookies.accessToken;

    if(!token){
        return res.status(403).json({
            message:"Unauthorized user please login"
        })
    }

    const decoded = jwt.verify(token.proccess.env.JWT_SECRET)
    if(!decoded){
        return res.status(400).json({
            message:"Token expired"
        })
    }

    const cacheUser = await redisClient.get(`user:${decoded.id}`)

    if(cacheUser){
        req.user = JSON.parse(cacheUser)
        return next()
    }

    const user = await User.findById(decoded.id).select("-password")

    if(!user){
        return res.status(400).json({
            message:"No user found with this id"
        })
    }
    await redisClient.setEx(`user:${user._id}`,3600,JSON.stringify(user))
    req.user = user
    next()
})