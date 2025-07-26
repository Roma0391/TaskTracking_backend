import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import Redis from 'ioredis'
import router from './routes/auth-router';
import { redisHandlers } from './redis/handlers';
dotenv.config();
const app = express();
const redisClient = new Redis(process.env.REDIS_URL as string);

mongoose.connect(process.env.DATABASE_URL as string)
.then(() => console.log('Database was connected successfuly'))
.catch(e => 	console.log(`Feild to connect to db`));

app.use(express.json());

app.use(cors());

app.use('/auth', router);


const PORT = process.env.PORT || 3001;

const startServer = () => {
	app.listen(PORT, () => {
		console.log(`Auth-service started on port ${PORT}`);
	});
	redisClient.subscribe('profile.create', (err, count) => {
		if(err) {
			throw new Error('Redis subscrib error occured')
		} else {
			console.log(`Subscribed successfully to ${count} channels!`);
			
		}
	});
	redisClient.on('message', (channel: string, message: string) => redisHandlers(channel, message))
}

startServer();
// app.listen(PORT, () => {
// 	console.log(`Auth-service started on port ${PORT}`);
// });