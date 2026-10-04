import redisClient from "../config/redis.js";

export const unauthenticatedRatelimiter = async(req,res,next)=>{
    try {
        const ip = req.ip;

        const key = `rate_limiter:ipAddress:${ip}`; 

        const limit = await redisClient.incr(key); 

        if(limit === 1){
            await redisClient.expire(key, 60);
        }
       else if(limit >5){
            const remainTime = await redisClient.ttl(key);
             return res.status(429).json({
               message : `To many request. Try again after ${remainTime} ` 
            });
        }
        next();
    } catch (error) {
        console.log("Rate limiter error:", error.message);
        return next();
    }
}

export const authenticatedRatelimiter = async(req,res, next)=>{
    try {
        const {_id} = req.user;

        const key = `rate_limiter:userId:${_id}`; 

        const limit = await redisClient.incr(key); 

        if(limit === 1){
            await redisClient.expire(key, 60);
        }
       else if(limit > 3){
            const remainTime = await redisClient.ttl(key);
             return res.status(429).json({
               message : `To many request. Try again after ${remainTime} ` 
            });
        }
        next();
    } catch (error) {
        console.log("Rate limiter error:", error.message);
       return next();
    }
}