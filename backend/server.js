import express from 'express';
import dns from 'dns';
import cookieParser from 'cookie-parser';
import urlRouter from './routes/urlRoutes.js';
import { url } from 'inspector';
dns.setServers(['8.8.8.8','8.8.4.4'])



const app = express();
app.use(express.json());
app.use(cookieParser());

// router 
app.use('/api/url', urlRouter);

const Port = process.env.PORT || 5000;

const startServer = async()=>{
    try {
        app.listen(Port, ()=>{
            console.log(`"Server is listen on port number ${Port}`);
        })
    } catch (error) {
        console.log("Error", error.message);
    }
}

startServer();