import TryCatch from '../middlewares/TryCatch.middleware.js'
export const  registerUser =  TryCatch(async (req,res)=>{
    const {name,email,password} = req.body || {}
    res.status(201).json({
        name,
        email,
        password
    })
})