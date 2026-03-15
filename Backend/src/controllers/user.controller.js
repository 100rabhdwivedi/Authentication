import { loginSchema, registerSchema } from '../config/zod.js'
import TryCatch from '../middlewares/TryCatch.middleware.js'
import senitize from 'mongo-sanitize'
import redisClient from '../config/redis.js'
import {User} from "../models/user.model.js"
import crypto from "crypto"
import sendMail from '../services/send.mail.js'
import bcrypt from 'bcrypt'
import { getOtpHtml, getVerifyEmailHtml } from '../config/html.js'
import {  generateToken, verifyRefreshToken } from '../config/generateToken.js'

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
        return  res.status(409).json({
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
        message:"If your email is valid, authentication link has been sent. It will be expired in 5 minutes."
    })
})

export const verifyUser = TryCatch(async(req,res)=>{
    const {token} = req.params

    if(!token){
        return res.status(400).json({
            message:"Verification token is required"
        })
    }
    const verifyKey = `verify:${token}`
    const userDataJson = await redisClient.get(verifyKey)

    if(!userDataJson){
        return res.status(400).json({
            message:"Verification Link is expired.",
        })
    }
    await redisClient.del(verifyKey)
    const userData = JSON.parse(userDataJson)
    
    const newUser = await User.create({
        name:userData.name,
        email:userData.email,
        password:userData.password
    })

    res.status(201).json({
        message:"Email verified successfully your account has been created :",
        user:{
            _id:newUser._id,
            name:newUser.name,
            email:newUser.email
        }
    })
})


export const login = TryCatch(async(req,res)=>{
    const senitizedBody = senitize(req.body)
    const validation = loginSchema.safeParse(senitizedBody)

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

    const {email,password} = validation.data

    const rateLimitKey = `login-rate-limit:${req.ip}:${email}`

    if(await redisClient.get(rateLimitKey)){
        return res.status(429).json({
            message:"Too many request try again later"
        })
    }

    const user = await User.findOne({email})

    if(!user){
        return res.status(401).json({
            message:"Invalid email or password"
        })
    }

    const comparePassword = await bcrypt.compare(password,user.password)

    if(!comparePassword){
        return res.status(401).json({
            message:"Invalid email or password"
        })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpKey = `otp:${email}`

    await redisClient.set(otpKey,JSON.stringify(otp),{EX:300})

    const subject = 'Otp for verification'
    const html = getOtpHtml({email,otp})

    await sendMail({email,subject , html})

    await redisClient.set(rateLimitKey,"true",{EX:60})

    res.json({
        message:"If your email is valid, otp has been sent. it will be valid for 5 minutes "
    })

})

export const verifyOtp = TryCatch(async(req,res)=>{
    const {email,otp} = req.body

    if(!email||!otp){
        return res.status(401).json({
            message:"Please provide all details"
        })
    }

    const otpKey = `otp:${email}`
    const storedOtpString = await redisClient.get(otpKey)

    if(!storedOtpString){
        return res.status(400).json({
            message:"Otp expired"
        })
    }

    const storedOtp = JSON.parse(storedOtpString)

    if(storedOtp !== otp){
        return res.status(400).json({
            message:"Invalid otp"
        })
    }
    await redisClient.del(otpKey)

    let user = await User.findOne({email}).select("-password")

    let tokenData = await generateToken(user._id,res)

    res.status(200).json({
        message:`Welcome ${user.name}`,
        user
    })
})

export const myProfile = TryCatch(async(req,res)=>{
    const user = req.user 
    res.status(200).json(user)
})

export const refreshToken = TryCatch(async(req,res)=>{

    const refreshToken = req.cookies.refreshToken

    if(!refreshToken){
        return res.status(401).json({
            message:"Invalid refresh token"
        })
    }

    const decode = await verifyRefreshToken(refreshToken)

    if(!decode){
        return res.status(401).json({
            message:"Invalid refresh token"
        })
    }

    // generate new access + refresh token
    await generateToken(decode.id,res)

    res.status(200).json({
        message:"Session refreshed"
    })
})