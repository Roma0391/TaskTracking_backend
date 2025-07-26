import express from 'express';
import Redis from 'ioredis';
import dotenv from 'dotenv';
import projectRoutes from './routes/project-route';
import { redisHandlers } from './redis/handlers';

const redisClient = new Redis(process.env.REDIS_URL as string);
dotenv.config();
const app = express();
app.use(express.json());
app.use('/project', projectRoutes);

const PORT = process.env.PORT || 3002;

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Profile service is running on port ${PORT}`);
  });
  redisClient.subscribe('user.delete', (err, count) => {
      if(err) {
        throw new Error('Redis subscrib error occured')
      } else {
        console.log(`Subscribed successfully to ${count} channels!`);
        
      }
    });
    redisClient.on('message', (channel: string, message: string) => redisHandlers(channel, message));
}

startServer();