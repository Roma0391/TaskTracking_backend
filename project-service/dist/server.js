"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ioredis_1 = __importDefault(require("ioredis"));
const dotenv_1 = __importDefault(require("dotenv"));
const project_route_1 = __importDefault(require("./routes/project-route"));
const handlers_1 = require("./redis/handlers");
const redisClient = new ioredis_1.default(process.env.REDIS_URL);
// const redisClient = new Redis("redis://redis:6379");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/project', project_route_1.default);
const PORT = process.env.PORT || 3002;
const startServer = () => {
    app.listen(PORT, () => {
        console.log(`Profile service is running on port ${PORT}`);
    });
    redisClient.subscribe('user.delete', (err, count) => {
        if (err) {
            throw new Error('Redis subscrib error occured');
        }
        else {
            console.log(`Subscribed successfully to ${count} channels!`);
        }
    });
    redisClient.on('message', (channel, message) => (0, handlers_1.redisHandlers)(channel, message));
};
startServer();
