import { Request, Response } from 'express';
import {PrismaClient} from '@prisma/client';
import { createCandidateValidation } from '../utils/validation';
const prisma = new PrismaClient();

export const createCandidate = async (req: Request, res: Response) => {
	try {
		const {projectId} = req.params
		const parsedData = createCandidateValidation(req.body);
		
		await prisma.candidate.create({
			data: {
				...parsedData,
				project: { 
					connect: {id: projectId}
				},
			}
		});
		res.status(201).json({
			success: true,
		})
	}catch (error) {
		res.status(500).json({
			success: false,
		})
	}
}

export const getCandidatesByAdminId = async (req: Request, res: Response) => {
	try {
		const adminId = req.headers['x-user-id'] as string;

		const page = +(req.query.page || 1);
		const limit = +(req.query.limit || 7);
		const startIndex = (page - 1) * limit;
		const adminProfile = await prisma.profile.findFirst({
			where: {
				id: adminId
			},
			select: {
				id: true
			}
		})
		const candidates = await prisma.candidate.findMany({
			where: {
				createdById: adminProfile?.id
			},
			include: {
				project: true,
			},
			skip: startIndex,
			take: limit
		});
		const candidatesCount = await prisma.candidate.count({
			where: {
				createdById: adminId
			}
		})
		const result = {
			data: candidates || [],
			curentPage: page,
			totalPage: Math.ceil(candidatesCount / limit),
			totalItems: candidatesCount,
		};
		res.status(201).json({
			success: true,
			result
		})
	}catch (error) {
		res.status(500).json({
			success: false,
		})
	}
}

export const removeCandidate = async (req: Request, res: Response) => {
	try {
		const {candidateId} = req.params
		await prisma.candidate.delete({
			where: {
				id: candidateId
			}
		});
		res.status(201).json({
			success: true,
		})
	}catch (error) {
		res.status(500).json({
			success: false,
		})
	}
}