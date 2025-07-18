import { Request, Response } from 'express';
import { createProjectValidation } from '../utils/validation';
import {PrismaClient} from '@prisma/client';
import { includes } from 'zod/v4';
const prisma = new PrismaClient();

const createProject = async (req: Request, res: Response) => {
	try {
		const createdBy = req.headers['x-user-id'] as string;
		const parsedData = createProjectValidation(req.body);
		const project = await prisma.project.create({
			data: {
				...parsedData,
				createdBy: {
					connect: {userId: createdBy}
				},
			}
		})
		res.status(201).json({
			success: true,
			message: 'Project created successfully',
		})
	}catch (error) {
		res.status(500).json({
			success: false,
			message: 'Project service create profile error occured'
		})
		return;
	}
}

const getAllProjects = async (req: Request, res: Response) => {
	try {
		const data = await prisma.project.findMany({
			include: {
				members: true,
				candidates: true,
				createdBy: true,
			}
		})
		res.status(201).json({
			success: true,
			message: 'Projects fetched successfully',
			data,
		})
	}catch (error) {
		res.status(500).json({
			success: false,
			message: 'Project service create profile error occured'
		})
		return;
	}
}

const getMyProjects = async (req: Request, res: Response) => {
	try {
		const userId = req.headers['x-user-id'] as string;
		const userRole = req.headers['x-user-role'] as string;
		const userProfile = await prisma.profile.findUnique({
			where: {userId}
		})

		if(!userProfile) {
				res.status(404).json({ 
				success: false,
				message: 'User not found'
			})
			return;
		}

		const data = userRole === 'user' ? await prisma.project.findMany({
			where: {
				members: {
					some: userProfile
				},
				candidates: {
					some: userProfile
				}
			},
		}) : await prisma.project.findMany({
			where: {
				creatorId: userId, 
			},
			include: {
				createdBy: true,
				candidates: true,
				members: true, 
			}
		})
		res.status(201).json({
			success: true,
			message: 'Projects fetched successfully',
			data,
		})
	}catch (error) {
		res.status(500).json({
			success: false,
			message: 'Project service create profile error occured'
		})
		return;
	}
}

const joinProject = async (req: Request, res: Response) => {
	try {
		const userId = req.headers['x-user-id'] as string;
		const {projectId} = req.params;
		const userProfile = await prisma.profile.findUnique({
			where: {userId}
		})
		if(!userProfile) {
				res.status(404).json({
				success: false,
				message: 'User not found'
			})
			return;
		}
		
		await prisma.project.update({
			where: {
				id: projectId
			},
			data: {
				candidates: {
					connect: userProfile
				},
			}
		})
		res.status(201).json({
			success: true,
			message: 'Projects joined successfully',
		})
	}catch (error) {
		res.status(500).json({
			success: false,
			message: 'Project service create profile error occured'
		})
		return;
	}
}

const addUserToProject = async (req: Request, res: Response) => {
	try {
		const adminId = req.headers['x-user-id'] as string;
		const {projectId} = req.params;
		const {userId} = req.body;

		const userProfile = await prisma.profile.findUnique({
			where: {id: userId}
		})
		if(!userProfile) {
				res.status(404).json({
				success: false,
				message: 'User not found'
			})
			return;
		}
		
		await prisma.project.update({
			where: {
				id: projectId
			},
			data: { 
				candidates: {
					disconnect: userProfile
				},
				members: {
					connect: userProfile
				},
			}
		})
		res.status(201).json({
			success: true,
			message: 'Projects joined successfully',
		})
	}catch (error) {
		res.status(500).json({
			success: false,
			message: 'Project service create profile error occured'
		})
		return;
	}
}


export {createProject, getAllProjects, joinProject, addUserToProject, getMyProjects}