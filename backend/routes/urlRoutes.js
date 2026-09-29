import express from 'express';
import {
    generate,
    deleteUrl
} from "../controllers/urlControllers.js";
import { authenticatedRatelimiter } from '../rateLimiter/userRateLimiter.js';
import { authmiddleWare } from '../middleware/authMiddleware.js';
const urlRouter = express.Router(); 


urlRouter.post('/generate',authmiddleWare, authenticatedRatelimiter, generate);
 
urlRouter.delete('/:id',authmiddleWare, deleteUrl);



export default urlRouter;