"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisHandlers = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const userModel_1 = __importDefault(require("../db/userModel"));
const redis = new ioredis_1.default(process.env.REDIS_URL);
const redisHandlers = async (channel, message) => {
    switch (channel) {
        case 'user.join_request':
            sendUserData(message);
            break;
    }
};
exports.redisHandlers = redisHandlers;
const User = userModel_1.default;
async function sendUserData(message) {
    const { userId } = JSON.parse(message);
    const userData = await User.findById(userId);
    const pub = redis.duplicate();
    pub.publish('user.join_response', JSON.stringify({
        userId: userData.id,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email
    }));
}
