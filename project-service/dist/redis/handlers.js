"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisHandlers = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const redisHandlers = (channel, message) => {
    switch (channel) {
        case 'user.delete':
            deleteProfile(message);
            break;
    }
};
exports.redisHandlers = redisHandlers;
const deleteProfile = async (message) => {
    const { userId } = JSON.parse(message);
    await prisma.profile.deleteMany({
        where: {
            userId
        }
    });
};
