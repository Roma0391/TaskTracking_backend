"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.finishTask = exports.fetchTaskById = exports.addTodoUser = exports.updateTaskLevel = exports.createSubtask = exports.createTask = void 0;
const validation_1 = require("../utils/validation");
const client_1 = require("@prisma/client");
const task_1 = require("../interfaces/task");
const prisma = new client_1.PrismaClient();
const createTask = async (req, res) => {
    try {
        const parsedData = (0, validation_1.createTaskValidation)(req.body);
        if (!parsedData.projectId) {
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
                status: task_1.TaskStatus.TODO,
                project: {
                    connect: { id: parsedData.projectId }
                },
            },
        });
        res.status(201).json({
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
        });
        return;
    }
};
exports.createTask = createTask;
const createSubtask = async (req, res) => {
    try {
        const parsedData = (0, validation_1.createSubtaskValidation)(req.body);
        if (!parsedData.projectId || !parsedData.parentTaskId || !parsedData.toDoProfileId) {
            res.status(400).json({
                success: false,
            });
            return;
        }
        const parentTask = await prisma.task.findUnique({
            where: { id: parsedData.parentTaskId },
            select: { subTasks: true },
        });
        if (!parentTask) {
            res.status(400).json({
                success: false,
            });
            return;
        }
        const taskProgress = ((parentTask.subTasks.filter(subtask => subtask.status === task_1.TaskStatus.DONE).length) / (parentTask.subTasks.length + 2) * 100).toFixed(0);
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
                        status: task_1.TaskStatus.IN_PROGRESS,
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
        });
        res.status(201).json({
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
        });
    }
};
exports.createSubtask = createSubtask;
const updateTaskLevel = async (req, res) => {
    try {
        const { taskId } = req.params;
        const data = req.body;
        await prisma.task.update({
            where: {
                id: taskId
            },
            data: data,
        });
        res.status(200).json({
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
        });
    }
};
exports.updateTaskLevel = updateTaskLevel;
const addTodoUser = async (req, res) => {
    try {
        const { taskId } = req.params;
        const data = req.body;
        await prisma.task.update({
            where: {
                id: taskId
            },
            data: {
                toDoProfileId: data.profileId,
                status: task_1.TaskStatus.IN_PROGRESS
            },
        });
        res.status(200).json({
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
        });
    }
};
exports.addTodoUser = addTodoUser;
const fetchTaskById = async (req, res) => {
    try {
        const { taskId } = req.params;
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
        });
        const result = {
            data: [task],
            curentPage: 1,
            totalPage: 1,
            totalItems: 1,
        };
        res.status(200).json({
            success: true,
            result
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
        });
    }
};
exports.fetchTaskById = fetchTaskById;
const finishTask = async (req, res) => {
    try {
        const { taskId } = req.params;
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
        const taskProgress = subTasks.every(subtask => subtask.status === task_1.TaskStatus.DONE) ? '100' : ((subTasks.filter(subtask => subtask.status === task_1.TaskStatus.DONE).length + 1) / (subTasks.length + 1) * 100).toFixed(0);
        const data = subTasks.length === 0 ? {
            status: task_1.TaskStatus.DONE,
            progress: 100,
        } : {
            status: task_1.TaskStatus.DONE,
            progress: 100,
            parentTask: {
                update: {
                    progress: +taskProgress,
                }
            },
        };
        await prisma.task.update({
            where: {
                id: taskId
            },
            data,
        });
        res.status(200).json({
            success: true,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
        });
    }
};
exports.finishTask = finishTask;
