import { Request, Response } from 'express';
import { createProfileValidation } from '../utils/validation';
import {PrismaClient} from '@prisma/client';
import Redis from 'ioredis'
const prisma = new PrismaClient();
const redisClient = new Redis(process.env.REDIS_URL as string);

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
		const pub = redisClient.duplicate();
		pub.publish('profile.create', JSON.stringify({createdBy, userId: parsedData.userId}));
		res.status(201).json({
			success: true,
		})
	}catch (error) {
		res.status(500).json({
			success: false,
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
			},
		})
		if (!myProfile) {
			res.status(404).json({
				success: false,
			})
		}
		const result = {
			data: [myProfile],
			curentPage: 1,
			totalPage: 1,
			totalItems: 1,
		};
		res.status(200).json({
			success: true,
			result
		})
	}catch (error) {
		res.status(500).json({
			success: false,
		})
		return;
	}
}

const fetchProfilesByProjectCreators = async (req: Request, res: Response) => {
	try {
		const userId = req.headers['x-user-id'] as string;
		if(!userId) {
			res.status(404).json({
				success: false,
			})
			return;
		}
		const flag = req.query.flag;
		const page = +(req.query.page || 1);
		const limit = +(req.query.limit || 7);
		const startIndex = (page - 1) * limit;
		const findQuery = flag === 'Create' ? {
				candidatesOfProject: {
					some: {
						creatorId: userId, 
					},
				},
			} : {
				memberOfProjects: {
					some: {
						creatorId: userId
					}
				},
			}
		const profiles = await prisma.profile.findMany({
			where: findQuery,
			include: {
				memberOfProjects: flag === 'Edit',
				candidatesOfProject: flag === 'Create',
			},
			skip: startIndex,
			take: limit,
		})
		if (!profiles) {
			res.status(404).json({
				success: false,
			})
		}
		const totalNumberOfProfiles = flag === 'Edit' ? await prisma.profile.count({
			where:  {
				memberOfProjects: {
					some: {
						creatorId: userId
					},
				},
			} 
		}) : await prisma.profile.count({
			where:  {
				candidatesOfProject: {
					some: {
						creatorId: userId
					},
				},
			} 
		});
		const result = {
			data: profiles || [],
			curentPage: page,
			totalPage: Math.ceil(totalNumberOfProfiles / limit),
			totalItems: totalNumberOfProfiles,
		};
		res.status(200).json({
			success: true,
			result
		})
	}catch (error) {
		res.status(500).json({
			success: false,
		})
		return;
	}
}

const editProfile = async (req: Request, res: Response) => {
	try {
		const {profileId, permisionStatus} = req.body;

		await prisma.profile.update({
			where: {
				id: profileId
			},
			data: {
				permisionStatus
			}
		})
		res.status(201).json({
			success: true,
		})
	}catch (error) {
		res.status(500).json({
			success: false,
		})
		return;
	}
}

export {createProfile, fetchMyProfile, editProfile, fetchProfilesByProjectCreators}