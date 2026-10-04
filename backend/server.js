import "dotenv/config";
import express from 'express';
import dns from 'dns';
import cookieParser from 'cookie-parser';
import cors from "cors";
import urlRouter from './routes/urlRoutes.js';
import userRouter from './routes/userRoutes.js'
import redirectRouter from './routes/redirectRoutes.js';
import analysisRouter from './routes/analysisRoutes.js'
import connectToMongoDb from './config/mongoDb.js';
import redisClient from './config/redis.js';
dns.setServers(['8.8.8.8','8.8.4.4'])



const app = express();
app.use(express.json());
app.use(cookieParser());



app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/user', userRouter);
app.use('/api/url', urlRouter);
app.use('/api/analysis', analysisRouter);

app.use('/api', redirectRouter);


const Port = process.env.PORT || 5000;

const startServer = async()=>{
    try {
        await connectToMongoDb();
        console.log('MongoDB connected');
        

        await redisClient.connect(); 
        console.log('Redis connected');
        app.listen(Port, ()=>{
            console.log(`"Server is listen on port number ${Port}`);
        })
    } catch (error) {
        console.log("Error", error.message);
    }
}

startServer();