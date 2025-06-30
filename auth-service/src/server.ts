import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors'
import cookieParser from 'cookie-parser'
import router from './routes/auth-router';
dotenv.config();
const app = express();

mongoose.connect(process.env.DATABASE_URL as string)
.then(() => console.log('Database was connected successfuly'))
.catch(e => 	console.log(`Feild to connect to db`));

app.use(express.json());
app.use(cookieParser());

app.use(cors());

app.use('/auth', router);


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`Auth-service started on port ${PORT}`);
});