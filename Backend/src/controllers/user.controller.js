import { registerSchema } from '../config/zod.js'
import TryCatch from '../middlewares/TryCatch.middleware.js'
import senitize from 'mongo-sanitize'
import redisClient from '../config/redis.js'
import {User} from "../models/user.model.js"
import crypto from "crypto"
import sendMail from '../services/send.mail.js'
import bcrypt from 'bcrypt'
import { getVerifyEmailHtml } from '../config/html.js'

export const  registerUser =  TryCatch(async (req,res)=>{
    const senitizedBody = senitize(req.body)
    const validation = registerSchema.safeParse(senitizedBody)

    if(!validation.success){
        const zodError = validation.error

        let firstErrorMessage = "Validation failed";
        let allErrors = [];

        if(zodError?.issues && Array.isArray(zodError.issues)){
            allErrors = zodError.issues.map((issue)=>({
                field:issue.path? issue.path.join("."):"unknown",
                message:issue.message || "Validation Error",
                code: issue.code
            }))
        }
        firstErrorMessage = allErrors[0].message || "Validation Error"

        return res.status(400).json({
            message:firstErrorMessage,
            error:allErrors
        })
    }

    const {name,email,password} = validation.data

    const rateLimitKey = `register-rate-limit:${req.ip}:${email}`

    if(await redisClient.get(rateLimitKey)){
        return  res.status(429).json({
            message:"Too many request try again later",
        })
    }

    let user = await User.findOne({email})

    if(user){
        return res.status(400).json({
            message:"User already exists"
        })
    }

    const hashPassword = await bcrypt.hash(password,10)

    const verifyToken = crypto.randomBytes(32).toString("hex")
    const verifyKey = `verify:${verifyToken}`
    const dataToStore = JSON.stringify({
        name,
        email,
        password:hashPassword
    }) 

    await redisClient.set(verifyKey,dataToStore,{EX:300})

    const subject = "Verify your email Account for Register";
    const html = getVerifyEmailHtml({email,token : verifyToken})

    await sendMail({email,subject,html})

    await redisClient.set(rateLimitKey,"true",{EX:60})

    res.status(200).json({
        message:"If your email is valid, averification link has been sent. It will be expired in 5 minutes."
    })
})