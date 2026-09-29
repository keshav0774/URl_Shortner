import express from 'express'; 
import {authmiddleWare} from '../middleware/authMiddleware.js'
import { getMyUrls, urlAnalysis } from '../controllers/analysisControllers.js';


const analysisRouter = express.Router(); 


analysisRouter.use(authmiddleWare);

analysisRouter.get('/getMyUrls', getMyUrls);
analysisRouter.get('/:id', urlAnalysis);

export default analysisRouter;