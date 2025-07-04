import { Request, Response } from 'express';
import { createProfileValidation } from '../utils/validation';
import {PrismaClient} from '@prisma/client';
import Redis from 'ioredis';
const prisma = new PrismaClient();
const redis = new Redis({
	host: process.env.REDIS_HOST,
	port: Number(process.env.REDIS_PORT),
});

interface IUser {
	user_id: string,
	user_role: string,
}
 
export interface ICreateProfileRequest extends Request {
	user?: IUser
}

const createProfile = async (req: ICreateProfileRequest, res: Response) => {
	try {
		const parsedData = createProfileValidation(req.body);
		await prisma.profile.create({
			data: parsedData
		})
		res.status(201).json({
			success: true,
			message: 'Profile created successfully',
		})
	}catch (error) {
		res.status(500).json({
			success: false,
			message: 'Project service create profile error occured'
		})
		return;
	}
}

export {createProfile}