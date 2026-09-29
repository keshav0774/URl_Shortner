import express from 'express'
import {
    authenticatedRatelimiter,
    unauthenticatedRatelimiter
} from '../rateLimiter/userRateLimiter.js';
import { authmiddleWare } from '../middleware/authMiddleware.js';
import { login, signup, logout, profile, deleteAcount, update } from '../controllers/userControllers.js';

const userRouter = express.Router();

userRouter.post('/signup',unauthenticatedRatelimiter,signup);
userRouter.post('/login',unauthenticatedRatelimiter,login);
userRouter.post('/logout',authmiddleWare,authenticatedRatelimiter,logout);
userRouter.get('/profile',authmiddleWare,authenticatedRatelimiter,profile);
userRouter.post('/delete',authmiddleWare,authenticatedRatelimiter,deleteAcount);
userRouter.patch('/update',authmiddleWare, update);

export default userRouter; 