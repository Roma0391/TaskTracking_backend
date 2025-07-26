import { Request, Response } from 'express';
import { createProjectValidation } from '../utils/validation';
import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

const createProject = async (req: Request, res: Response) => {
	try {
		const createdBy = req.headers['x-user-id'] as string;
		const parsedData = createProjectValidation(req.body);
		await prisma.project.create({
			data: {
				...parsedData,
				createdBy: {
					connect: {userId: createdBy}
				},
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

const getAllProjects = async (req: Request, res: Response) => {
	try {
		const userId = req.headers['x-user-id'] as string;
		const userRole = req.headers['x-user-role'] as string;
		const flag = req.query.flag;
		const page = +(req.query.page || 1);
		const limit = +(req.query.limit || 7);
		const startIndex = (page - 1) * limit;

		let findQuery;
		if(userRole === 'admin') {
			const userProfile = await prisma.profile.findUnique({
				where: {userId}
			})
			if(!userProfile) {
					res.status(401).json({ 
					success: false,
				})
				return;
			}
			findQuery = {
				createdBy: userProfile
			}
		} else {
switch(flag) {
			case 'my':
				findQuery = {
					members: {
						some: {
							userId: userId
						}
					}
				};
				break;
			case 'join':
				findQuery = {
					candidates: {
						none: {
							userId: userId
						}
					},
					members: {
						none: {
							userId: userId
						}
					}
				};
				break;
			case 'pending':
				findQuery = {
					candidates: {
						some: {
							userId: userId
						}
					}
				};
				break;
			}
		}
		const data = await prisma.project.findMany({
			where: findQuery,
			include: {
				members: flag === 'my',
				candidates: flag !== 'my',
				createdBy: true,
			},
			skip: startIndex,
			take: limit,
		})
		const totalNumberOfProjects = await prisma.project.count({
			where: findQuery
		})
		const result = {
			data: data || [],
			curentPage: page,
			totalPage: Math.ceil(totalNumberOfProjects / limit),
			totalItems: totalNumberOfProjects,
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

// const getMyProjects = async (req: Request, res: Response) => {
// 	try {
// 		const userId = req.headers['x-user-id'] as string;
// 		const userRole = req.headers['x-user-role'] as string;
// 		const flag = req.query.flag;
// 		const page = +(req.query.page || 1);
// 		const limit = +(req.query.limit || 7);
// 		const startIndex = (page - 1) * limit;
// 		const userProfile = await prisma.profile.findUnique({
// 			where: {userId}
// 		})
// 		if(!userProfile) {
// 				res.status(401).json({ 
// 				success: false,
// 			})
// 			return;
// 		}
// 		const data = await prisma.project.findMany({
// 			where: {
// 				createdBy: userProfile
// 			},
// 			include: {
// 				createdBy: true,
// 				members: flag === 'Edit',
// 				candidates: flag === 'Create'
// 			},
// 			skip: startIndex,
// 			take: limit,
// 		})
// 		const totalNumberOfProjects =  await prisma.project.count({
// 			where: {
// 				createdBy: userProfile
// 			},
// 		})
// 		const result = {
// 			data: data || [],
// 			curentPage: page,
// 			totalPage: Math.ceil(totalNumberOfProjects / limit),
// 			totalItems: totalNumberOfProjects,
// 		};

// 		res.status(200).json({
// 			success: true,
// 			result
// 		})
// 	}catch (error) {
// 		res.status(500).json({
// 			success: false,
// 		})
// 		return;
// 	}
// }

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
		})
	}catch (error) {
		res.status(500).json({
			success: false,
		})
		return;
	}
}

const quitProject = async (req: Request, res: Response) => {
	try {
		const userId = req.headers['x-user-id'] as string;
		const {projectId} = req.params;
		const userProfile = await prisma.profile.findUnique({
			where: {userId}
		})
		if(!userProfile) {
				res.status(404).json({
				success: false,
			})
			return;
		}
		await prisma.project.update({
			where: {
				id: projectId
			},
			data: {
				members: {
					disconnect: userProfile
				},
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

const deleteProject = async (req: Request, res: Response) => {
	try {
		const userId = req.headers['x-user-id'] as string;
		const {projectId} = req.params;
		await prisma.project.delete({
			where: {
				id: projectId
			},
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
		})
	}catch (error) {
		res.status(500).json({
			success: false,
		})
		return;
	}
}

const removeProfilefromProject = async (req: Request, res: Response) => {
	try {
		const {projectId} = req.params;
		const {profileId} = req.body;

		const userProfile = await prisma.profile.findUnique({
			where: {id: profileId}
		})
		if(!userProfile) {
				res.status(404).json({
				success: false,
			})
			return;
		}
		await prisma.project.update({
			where: {
				id: projectId
			},
			data: {
				members: {
					disconnect: userProfile
				}
			}
		})
		res.status(200).json({
			success: true,
		})
	}catch (error) {
		res.status(500).json({
			success: false,
		})
		return;
	}
}

export {createProject, getAllProjects, joinProject, addUserToProject, removeProfilefromProject, quitProject, deleteProject}