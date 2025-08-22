import { Request, Response } from 'express';
import { createProfileValidation } from '../utils/validation';
import {PrismaClient} from '@prisma/client';
import { Roles } from '../../../interfaces/user';
const prisma = new PrismaClient();

export const createProfile = async (req: Request, res: Response) => {
	try {		
		const createdBy = req.headers['x-user-id'] as string;
		const parsedData = createProfileValidation(req.body);
		
		const profile = await prisma.profile.create({
			data: {
				...parsedData,
				createdById: createdBy
			}
		})
		if(parsedData.role === Roles.USER) {
			await prisma.profile.update({
				where: {
					id: profile.id,
				},
				data: {
					project: {
						connect: {
							id: parsedData.projectId
						}
					}
				}
			});
			await prisma.candidate.deleteMany({
				where: {AND: [{userId: parsedData.userId}, {projectId: parsedData.projectId}]}
			});
		}

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

export const fetchMyProfile = async (req: Request, res: Response) => {
	try {  
		const userId = req.headers['x-user-id'] as string;
		const {projectId} = req.params;
		const myProfiles = await prisma.profile.findMany({
			where: {
				userId,
			},
		})
		const myProfile = myProfiles.filter(profile => profile.projectId === null || profile.projectId === projectId)[0]
		if (!myProfile) {
			res.status(404).json({
				success: false,
			})
			return;
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
	}
}

export const getMembersByAdminId = async (req: Request, res: Response) => {
	try {		
		const adminId = req.headers['x-user-id'] as string;
		console.log(adminId);
		
		if(!adminId) {
			res.status(404).json({
				success: false,
			})
			return;
		}

		const page = +(req.query.page || 1);
		const limit = +(req.query.limit || 7);
		const startIndex = (page - 1) * limit;

		const profiles = await prisma.profile.findMany({
			where: {
				createdById: adminId
			},
			include: {
				project: true
			},
			skip: startIndex,
			take: limit,
		})
		if (!profiles) {
			res.status(404).json({
				success: false,
			});
			return;
		}
		const totalNumberOfProfiles = await prisma.profile.count({
			where:  {
				createdById: adminId
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

export const editProfile = async (req: Request, res: Response) => {
	try {
		const {permisionStatus} = req.body;
		const profileId = req.params.profileId;

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
	}
}
