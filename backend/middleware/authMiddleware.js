import jwt from 'jsonwebtoken';
import userModel from '../models/userSchema.js';
import redisClient from '../config/redis.js';

export const authmiddleWare = async (req,res,next)=>{
    try {
        const { token } = req.cookies;
        if(!token){
            return res.status(403).json({
                message : "token not fount"
            })
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET); 
        

        // check token is blac listed or not 

        const blockedToken = await redisClient.get(
            `blockList:${token}`
        );

        
        if(blockedToken){
            return res.status(401).json({
                message : "Please Login Again"
            })
        }
        const userId = payload._id;
        if(!userId){
            return res.status(404).json({
                message : "userid not found"
            })
        }
        const user = await userModel.findById(userId);
        if(!user) return res.status(404).json({message : "user not found"});

        req.user = user;
        req.token = token;
        req.payload = payload;
        next();
        
    } catch (error) {
        res.status(401).json({
            message : "Can't Authenticate"
        })
    }
}