import express from 'express'; 
import authmiddleWare from '../middleware/authMiddleware.js'
import { analysis, urlAnalysis } from '../controllers/analysisControllers.js';
const analysisRouter = express.Router(); 


analysisRouter(authmiddleWare);

analysisRouter.get('/analysis', analysis);
analysisRouter.get('/analysis/:id', urlAnalysis);