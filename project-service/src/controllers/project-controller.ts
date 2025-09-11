import { Request, Response } from 'express';
import { createProjectValidation } from '../utils/validation';
import {PrismaClient} from '@prisma/client';
import Redis from 'ioredis';
import { ProjectStatus } from '../interfaces/project';
import { Roles } from '../interfaces/user';
import { PROJECT_FLAGS } from '../interfaces/flags';
const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL as string);

export const createProject = async (req: Request, res: Response) => {
	try {
		const adminId = req.headers['x-user-id'] as string; 
		const adminProfile = await prisma.profile.findFirst({where: {userId: adminId}})

		if(!adminProfile) {
				res.status(401).json({ 
				success: false,
			})
			return;
		}
		const parsedData = createProjectValidation(req.body);
		
		await prisma.project.create({
			data: {
				...parsedData,
				status: ProjectStatus.ACTIVE,
				createdBy: { 
					connect: {id: adminProfile.id}
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

export const getAllProjects = async (req: Request, res: Response) => {
	try {
		const userId = req.headers['x-user-id'] as string;
		const userRole = req.headers['x-user-role'] as string;
		const flag = req.query.flag;
		const page = +(req.query.page || 1);
		const limit = +(req.query.limit || 7);
		const startIndex = (page - 1) * limit;
		let findQuery;
		if(userRole === Roles.ADMIN) {
			const userProfile = await prisma.profile.findFirst({
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
			case PROJECT_FLAGS.MY:
				findQuery = {
					members: {
						some: {
							userId: userId
						}
					}
				};
				break;
			case PROJECT_FLAGS.JOIN:
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
			case PROJECT_FLAGS.PENDIDNG:
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
				members: flag === PROJECT_FLAGS.MY,
				candidates: flag !== PROJECT_FLAGS.MY,
				createdBy: true,
				tasks: {
					include: {
						toDoProfile: true,
					}
				}
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

export const getProjectById = async (req: Request, res: Response) => {
	try {
		const {projectId} = req.params; 
		const project = await prisma.project.findUnique({
			where: {
				id: projectId
			},
			include: {
				members: true,
				tasks: {
					include: {
						toDoProfile: true,
					}
				},
				createdBy: true,
				candidates: true,
			}
		})
		if(!project) {
			res.status(401).json({ 
				success: false,
			});
			return;
		}
		const result = {
			data: [project],
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

export const joinProject = async (req: Request, res: Response) => {
	try {
		const userId = req.headers['x-user-id'] as string;
		const {projectId} = req.params;
		const pub = redis.duplicate();
		const sub = redis.duplicate();
		const project = await prisma.project.findUnique({where: {id: projectId}})
		pub.publish('user.join_request', JSON.stringify({userId}));
		sub.subscribe('user.join_response');
		sub.on('message', async (channel: string, message: string) => {
			if(channel === 'user.join_response') {
				const data = JSON.parse(message)
				await prisma.candidate.create({
					data: {
						...data,
						createdById: project?.createdById,
						project: {
							connect: {
								id: projectId
							}
						}
					}
				});
				res.status(201).json({
					success: true,
				})
			}
		})
		
	}catch (error) {
		res.status(500).json({
			success: false,
		})
	}
}

export const quitProject = async (req: Request, res: Response) => {
	try {
		const userId = req.headers['x-user-id'] as string;
		const {projectId} = req.params;
		const userProfile = await prisma.profile.findFirst({
			where: {AND: [{userId}, {projectId}]}
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
			},
		})
		await prisma.profile.delete({
			where: {id: userProfile.id}
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

export const deleteProject = async (req: Request, res: Response) => {
	try {
		const {projectId} = req.params;
		await prisma.project.delete({
			where: {
				id: projectId
			}
		});
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

export const removeProfilefromProject = async (req: Request, res: Response) => {
	try {
		const {projectId} = req.params;
		const {profileId} = req.body;

		const userProfile = await prisma.profile.findFirst({
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
		await prisma.profile.delete({
			where: {id: profileId}
		})
		res.status(200).json({
			success: true,
		})
	}catch (error) {
		res.status(500).json({
			success: false,
		}) 
	}
}

export const updateProjectOption = async (req: Request, res: Response) => {
	try {
		const {projectId} = req.params;
		const data = req.body;

		await prisma.project.update({
			where: {
				id: projectId
			},
			data: data,
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
