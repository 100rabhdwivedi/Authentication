import crypto from 'crypto'
import redisClient from '../config/redis.js';


export const generateCSRFToken = async (userId, res) => {
    const csrfToken = crypto.randomBytes(32).toString("hex")

    const csrfKey = `csrf:${userId}`
    await redisClient.setEx(csrfKey, 3600, csrfToken)

    res.cookie("csrfToken", csrfToken, {
        httpOnly: false,
        secure: true,
        sameSite: "none",
        maxAge: 60 * 60 * 1000
    })
    return csrfToken
}

export const verifyCSRFToken = async (req, res, next) => {
    try {
        // ✅ skip safe routes
        if (req.method === "GET" || req.path === "/logout") {
            return next();
        }

        const userId = req.user?._id;

        if (!userId) {
            return res.status(401).json({
                message: "User is not authenticated"
            });
        }

        const clientToken = req.headers["x-csrf-token"];

        if (!clientToken) {
            return res.status(403).json({
                message: "CSRF Token missing",
                code: "CSRF_TOKEN_MISSING"
            });
        }

        const storedToken = await redisClient.get(`csrf:${userId}`);

        if (!storedToken || storedToken !== clientToken) {
            return res.status(403).json({
                message: "Invalid CSRF Token",
                code: "CSRF_TOKEN_INVALID"
            });
        }

        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "CSRF verification failed"
        });
    }
};

export const revokeCSRFTOKEN = async(userId) =>{
    const csrfKey = `csrf:${userId}`
    await redisClient.del(csrfKey)
}

export const refreshCSRFToken = async(userId,res) =>{
    await revokeCSRFTOKEN(userId)

    return await generateCSRFToken(userId,res)
}