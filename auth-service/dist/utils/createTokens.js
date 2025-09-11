"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const refreshTokenModel_1 = __importDefault(require("../db/refreshTokenModel"));
const RefreshToken = refreshTokenModel_1.default;
const createTokens = async (user) => {
    const jwtBody = {
        user_id: user._id,
        user_role: user.role,
        isAuthUpprove: user.isAuthUpprove,
        user_firstName: user.firstName,
        user_lastName: user.lastName,
    };
    const accessToken = jsonwebtoken_1.default.sign(jwtBody, process.env.JWT_SECRET, { expiresIn: '24h' });
    const refreshToken = crypto_1.default.randomBytes(40).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await RefreshToken.create({
        token: refreshToken,
        user: user._id,
        expiresAt,
    });
    return { accessToken, refreshToken };
};
exports.default = createTokens;
