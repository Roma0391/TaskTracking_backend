"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_http_proxy_1 = __importDefault(require("express-http-proxy"));
const auth_middleware_1 = __importDefault(require("./middlewares/auth-middleware"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const PORT = process.env.PORT || 3000;
const proxyOptions = {
    proxyReqPathResolver: (req) => {
        return req.originalUrl.replace(/^\/api-geteway/, "");
    },
    proxyErrorHandler: (err, res, next) => {
        res.status(500).json({
            success: false,
            message: "Proxy server error",
        });
        return;
    },
};
app.use(`/api-geteway/auth`, auth_middleware_1.default, (0, express_http_proxy_1.default)(process.env.AUTH_SERVICE_HOST, {
    ...proxyOptions,
}));
app.use(`/api-geteway/project`, auth_middleware_1.default, (0, express_http_proxy_1.default)(process.env.PROJECT_SERVICE_HOST, {
    ...proxyOptions,
}));
app.listen(PORT, () => {
    console.log(`Api-geteway started on port ${PORT}`);
    console.log(`Auth-service started on ${process.env.AUTH_SERVICE_HOST}`);
    console.log(`Project-service started on ${process.env.PROJECT_SERVICE_HOST}`);
});
