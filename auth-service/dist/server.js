"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const ioredis_1 = __importDefault(require("ioredis"));
const auth_router_1 = __importDefault(require("./routes/auth-router"));
const handlers_1 = require("./redis/handlers");
dotenv_1.default.config();
const app = (0, express_1.default)();
const redisClient = new ioredis_1.default(process.env.REDIS_URL);
mongoose_1.default.connect(process.env.DATABASE_URL)
    .then(() => console.log('Database was connected successfully'))
    .catch(e => console.log(`Faild connecting to db`));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/auth', auth_router_1.default);
const PORT = process.env.PORT || 3001;
const startServer = () => {
    app.listen(PORT, () => {
        console.log(`Auth-service started on port ${PORT}`);
    });
    redisClient.subscribe('user.join_request', (err, count) => {
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
