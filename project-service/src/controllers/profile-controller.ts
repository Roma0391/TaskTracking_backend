import { Request, Response } from 'express';
import { createProfileValidation } from '../utils/validation';
import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

const createProfile = async (req: Request, res: Response) => {
	try {
		const createdBy = req.headers['x-user-id'] as string;
		const parsedData = createProfileValidation(req.body);
		await prisma.profile.create({
			data: {
				...parsedData,
				createdById: createdBy,
			}
		})
		res.status(201).json({
			success: true,
			message: 'Profile created successfully',
		})
	}catch (error) {
		res.status(500).json({
			success: false,
			message: 'Profile service create profile error occured'
		})
		return;
	}
}

const fetchMyProfile = async (req: Request, res: Response) => {
	try {
		const userId = req.headers['x-user-id'] as string;
		const myProfile = await prisma.profile.findUnique({
			where: {
				userId
			}
		})
		res.status(200).json({
			success: true,
			message: 'Profile fetched successfully',
			data: myProfile
		})
	}catch (error) {
		res.status(500).json({
			success: false,
			message: 'Profile service fetch profile error occured'
		})
		return;
	}
}

export {createProfile, fetchMyProfile}