import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import router from './routes/auth-router';
import cookieParser from 'cookie-parser'
dotenv.config();
const app = express();

mongoose.connect(process.env.DATABASE_URL as string)
.then(() => console.log('Database was connected successfuly'))
.catch(e => 	console.log(`Feild to connect to db`));

app.use(express.json());
app.use(cors())
app.use(cookieParser());

app.use('/auth', router);


const PORT = 3000;

app.listen(PORT, () => {
	console.log(`Auth-service started on port ${PORT}`);
});