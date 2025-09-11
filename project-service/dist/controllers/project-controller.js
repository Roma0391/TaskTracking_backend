"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProjectOption = exports.removeProfilefromProject = exports.deleteProject = exports.quitProject = exports.joinProject = exports.getProjectById = exports.getAllProjects = exports.createProject = void 0;
const validation_1 = require("../utils/validation");
const client_1 = require("@prisma/client");
const ioredis_1 = __importDefault(require("ioredis"));
const project_1 = require("../interfaces/project");
const user_1 = require("../interfaces/user");
const flags_1 = require("../interfaces/flags");
const prisma = new client_1.PrismaClient();
const redis = new ioredis_1.default(process.env.REDIS_URL);
const createProject = async (req, res) => {
    try {
        const adminId = req.headers['x-user-id'];
        const adminProfile = await prisma.profile.findFirst({ where: { userId: adminId } });
        if (!adminProfile) {
            res.status(401).json({
                success: false,
            });
            return;
        }
        const parsedData = (0, validation_1.createProjectValidation)(req.body);
        await prisma.project.create({
            data: {
                ...parsedData,
                status: project_1.ProjectStatus.ACTIVE,
                createdBy: {
                    connect: { id: adminProfile.id }
                },
            }
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
exports.createProject = createProject;
const getAllProjects = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const userRole = req.headers['x-user-role'];
        const flag = req.query.flag;
        const page = +(req.query.page || 1);
        const limit = +(req.query.limit || 7);
        const startIndex = (page - 1) * limit;
        let findQuery;
        if (userRole === user_1.Roles.ADMIN) {
            const userProfile = await prisma.profile.findFirst({
                where: { userId }
            });
            if (!userProfile) {
                res.status(401).json({
                    success: false,
                });
                return;
            }
            findQuery = {
                createdBy: userProfile
            };
        }
        else {
            switch (flag) {
                case flags_1.PROJECT_FLAGS.MY:
                    findQuery = {
                        members: {
                            some: {
                                userId: userId
                            }
                        }
                    };
                    break;
                case flags_1.PROJECT_FLAGS.JOIN:
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
                case flags_1.PROJECT_FLAGS.PENDIDNG:
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
                members: flag === flags_1.PROJECT_FLAGS.MY,
                candidates: flag !== flags_1.PROJECT_FLAGS.MY,
                createdBy: true,
                tasks: {
                    include: {
                        toDoProfile: true,
                    }
                }
            },
            skip: startIndex,
            take: limit,
        });
        const totalNumberOfProjects = await prisma.project.count({
            where: findQuery
        });
        const result = {
            data: data || [],
            curentPage: page,
            totalPage: Math.ceil(totalNumberOfProjects / limit),
            totalItems: totalNumberOfProjects,
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
        return;
    }
};
exports.getAllProjects = getAllProjects;
const getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;
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
        });
        if (!project) {
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
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
        });
        return;
    }
};
exports.getProjectById = getProjectById;
const joinProject = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { projectId } = req.params;
        const pub = redis.duplicate();
        const sub = redis.duplicate();
        const project = await prisma.project.findUnique({ where: { id: projectId } });
        pub.publish('user.join_request', JSON.stringify({ userId }));
        sub.subscribe('user.join_response');
        sub.on('message', async (channel, message) => {
            if (channel === 'user.join_response') {
                const data = JSON.parse(message);
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
                });
                return;
            }
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
        });
    }
};
exports.joinProject = joinProject;
const quitProject = async (req, res) => {
    try {
        const userId = req.headers['x-user-id'];
        const { projectId } = req.params;
        const userProfile = await prisma.profile.findFirst({
            where: { AND: [{ userId }, { projectId }] }
        });
        if (!userProfile) {
            res.status(404).json({
                success: false,
            });
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
        });
        await prisma.profile.delete({
            where: { id: userProfile.id }
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
exports.quitProject = quitProject;
const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        await prisma.project.delete({
            where: {
                id: projectId
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
exports.deleteProject = deleteProject;
const removeProfilefromProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { profileId } = req.body;
        const userProfile = await prisma.profile.findFirst({
            where: { id: profileId }
        });
        if (!userProfile) {
            res.status(404).json({
                success: false,
            });
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
        });
        await prisma.profile.delete({
            where: { id: profileId }
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
exports.removeProfilefromProject = removeProfilefromProject;
const updateProjectOption = async (req, res) => {
    try {
        const { projectId } = req.params;
        const data = req.body;
        await prisma.project.update({
            where: {
                id: projectId
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
        return;
    }
};
exports.updateProjectOption = updateProjectOption;
