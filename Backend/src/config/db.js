import mongoose from "mongoose";

const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI,{
            dbName:"MERNAuthentication",
        })
        console.log("MongoDB connected:")
    } catch (error) {
        console.log("Failed to connect Database:")
    }
}

export default connectDb