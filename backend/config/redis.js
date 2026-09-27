import { createClient } from 'redis';

const redisClient = createClient({
    username: 'default',
    password: process.env.REDISPASSWORD,
    socket: {
        host: 'redis-16714.c14.us-east-1-2.ec2.cloud.redislabs.com',
        port: 16714
    }
});
redisClient.on('error', err => console.log('Redis Client Error', err));

   


export default redisClient;


