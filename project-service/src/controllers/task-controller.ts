import { Request, Response } from 'express';
import { createSubtaskValidation, createTaskValidation } from '../utils/validation';
import {PrismaClient} from '@prisma/client';
import { TaskStatus } from '../interfaces/task';
const prisma = new PrismaClient();

export const createTask = async (req: Request, res: Response) => {
	try {
		const parsedData = createTaskValidation(req.body);
		
		if(!parsedData.projectId) {
			res.status(400).json({
				success: false,
			});
			return;
		}
		
		await prisma.task.create({
			data: {
				title: parsedData.title,
				description: parsedData.description || '',
				deadline: parsedData.deadline,
				priorityLevel: parsedData.priorityLevel,
				status: TaskStatus.TODO,
				project: {
					connect: { id: parsedData.projectId }
				},
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

export const createSubtask = async (req: Request, res: Response) => {
	try {
		const parsedData = createSubtaskValidation(req.body);
		if(!parsedData.projectId || !parsedData.parentTaskId || !parsedData.toDoProfileId) {
			res.status(400).json({
				success: false,
			});
			return;
		}
		const parentTask = await prisma.task.findUnique({
			where: {id: parsedData.parentTaskId},
			select: {subTasks: true},
		});
		if(!parentTask) {
			res.status(400).json({
				success: false,
			});
			return;
		}
		
		const taskProgress = ((parentTask.subTasks.filter(subtask => subtask.status === TaskStatus.DONE).length) / (parentTask.subTasks.length + 2) * 100).toFixed(0);
		
		await prisma.task.update({
			where: {
				id: parsedData.parentTaskId,
			},
			data: {
				progress: +taskProgress,
				subTasks: {
					create: {
						title: parsedData.title,
						description: parsedData.description || '',
						deadline: parsedData.deadline,
						status: TaskStatus.IN_PROGRESS,
						priorityLevel: parsedData.priorityLevel,
						project: {
							connect: { id: parsedData.projectId }
						},
						toDoProfile: {
							connect: { id: parsedData.toDoProfileId }
						}
					}
				}
			},
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

export const updateTaskLevel = async (req: Request, res: Response) => {
	try {
		const {taskId} = req.params;
		const data = req.body;
		await prisma.task.update({
			where: {
				id: taskId
			},
			data: data,
		});
		res.status(200).json({
			success: true,
		})
	}catch (error) {
		res.status(500).json({
			success: false,
		})
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
				status: TaskStatus.IN_PROGRESS
			},
		});
		res.status(200).json({
			success: true,
		})
	}catch (error) {
		res.status(500).json({
			success: false,
		})
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
				subTasks: {
					include: {
						toDoProfile: true
					}
				},
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
				},
			}
		});
		const subTasks = currentTask?.parentTask?.subTasks || [];
		
		const taskProgress = subTasks.every(subtask => subtask.status === TaskStatus.DONE) ? '100' : ((subTasks.filter(subtask => subtask.status === TaskStatus.DONE).length + 1) / (subTasks.length + 1) * 100).toFixed(0);
		const data = subTasks.length === 0 ? {
			status: TaskStatus.DONE,
			progress: 100,
		} : {
			status: TaskStatus.DONE,
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
		});
		res.status(200).json({
			success: true,
		})
	}catch (error) {
		res.status(500).json({
			success: false,
		})
	}
}