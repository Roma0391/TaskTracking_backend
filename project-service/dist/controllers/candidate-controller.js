"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCandidate = exports.getCandidatesByAdminId = exports.createCandidate = void 0;
const client_1 = require("@prisma/client");
const validation_1 = require("../utils/validation");
const prisma = new client_1.PrismaClient();
const createCandidate = async (req, res) => {
    try {
        const { projectId } = req.params;
        const parsedData = (0, validation_1.createCandidateValidation)(req.body);
        await prisma.candidate.create({
            data: {
                ...parsedData,
                project: {
                    connect: { id: projectId }
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
exports.createCandidate = createCandidate;
const getCandidatesByAdminId = async (req, res) => {
    try {
        const adminId = req.headers['x-user-id'];
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
        });
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
        });
        const result = {
            data: candidates || [],
            curentPage: page,
            totalPage: Math.ceil(candidatesCount / limit),
            totalItems: candidatesCount,
        };
        res.status(201).json({
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
exports.getCandidatesByAdminId = getCandidatesByAdminId;
const removeCandidate = async (req, res) => {
    try {
        const { candidateId } = req.params;
        await prisma.candidate.delete({
            where: {
                id: candidateId
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
exports.removeCandidate = removeCandidate;
