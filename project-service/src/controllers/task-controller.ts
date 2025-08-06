import { Request, Response } from 'express';
import { createSubtaskValidation, createTaskValidation } from '../utils/validation';
import {PrismaClient} from '@prisma/client';
const prisma = new PrismaClient();

export const createTask = async (req: Request, res: Response) => {
	try {
		
		const createdBy = req.headers['x-user-id'] as string;
		const parsedData = createTaskValidation(req.body);
		console.log('Creating task with data:', parsedData);
		
		if(!parsedData.projectId) {
			res.status(400).json({
				success: false,
			});
			return;
		}
		const project = await prisma.project.findUnique({
			where: { id: parsedData.projectId },
		});
		console.log('Found project:', project);
		
		if(!project) {
			res.status(404).json({
				success: false,
			});
			return;
		}
		if(project.creatorId !== createdBy) {
			res.status(403).json({
				success: false,
			});
			return;
		}
		
		await prisma.task.create({
			data: {
				title: parsedData.title,
				description: parsedData.description || '',
				deadline: parsedData.deadline,
				priorityLevel: parsedData.priorityLavel,
				project: {
					connect: { id: parsedData.projectId }
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

export const createSubtask = async (req: Request, res: Response) => {
	try {
		console.log('Creating subtask with headers:', req.headers);
		
		const createdBy = req.headers['x-user-id'] as string;

		const parsedData = createSubtaskValidation(req.body);
		console.log('Creating subtask with data:', parsedData);
		
		if(!parsedData.projectId || !parsedData.parentTaskId || !parsedData.toDoProfileId) {
			res.status(400).json({
				success: false,
			});
			return;
		}
		const project = await prisma.project.findUnique({
			where: { id: parsedData.projectId },
		});
		if(!project) {
			res.status(404).json({
				success: false,
			});
			return;
		}
		
		await prisma.task.update({
			where: {
				id: parsedData.parentTaskId,
			},
			data: {
				subTasks: {
					create: {
						title: parsedData.title,
						description: parsedData.description || '',
						deadline: parsedData.deadline,
						status: 'inProgress',
						priorityLevel: parsedData.priorityLavel,
						project: {
							connect: { id: parsedData.projectId }
						},
						toDoProfile: {
							connect: { id: parsedData.toDoProfileId }
						}
					}
				}
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

export const updateTaskLevel = async (req: Request, res: Response) => {
	try {
		const {taskId} = req.params;
		const data = req.body;
		await prisma.task.update({
			where: {
				id: taskId
			},
			data: data
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

export const addTodoUser = async (req: Request, res: Response) => {
	try {
		const {taskId} = req.params;
		const data = req.body;
		await prisma.task.update({
			where: {
				id: taskId
			},
			data: {
				toDoProfileId: data.profileId,
				status: 'inProgress'
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

export const fetchTaskById = async (req: Request, res: Response) => {
	try {
		const {taskId} = req.params;
		const task = await prisma.task.findUnique({
			where: {
				id: taskId
			},
			include: {
				project: true,
				toDoProfile: true,
				subTasks: {
					include: {
						toDoProfile: true
					}
				}
			}
		})
		
		const result = {
			data: [task],
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

export const finishTask = async (req: Request, res: Response) => {
	try {
		const {taskId} = req.params;
		const currentTask = await prisma.task.findUnique({
			where: {
				id: taskId
			},
			include: {
				parentTask: {
					include: {
						subTasks: true
					}
				}
			}
		});
		const subTasks = currentTask?.parentTask?.subTasks || [];
		
		const taskProgress = subTasks.every(subtask => subtask.status === 'done') ? '100' : ((subTasks.filter(subtask => subtask.status === 'done').length + 1) / (subTasks.length + 1) * 100).toFixed(0);
		const data = subTasks.length === 0 ? {
			status: 'done',
			progress: 100,
		} : {
			status: 'done',
			progress: 100,
			parentTask: {
					update: {
						progress: +taskProgress,
					}
				},
		}
		await prisma.task.update({
			where: {
				id: taskId
			},
			data,
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