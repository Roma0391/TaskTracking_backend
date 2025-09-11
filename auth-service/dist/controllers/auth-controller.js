"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.upproveAuth = exports.getUsers = exports.refreshTokens = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const flags_1 = require("../interfaces/flags");
const userModel_1 = __importDefault(require("../db/userModel"));
const validation_1 = require("../utils/validation");
const createTokens_1 = __importDefault(require("../utils/createTokens"));
const refreshTokenModel_1 = __importDefault(require("../db/refreshTokenModel"));
const ioredis_1 = __importDefault(require("ioredis"));
const user_1 = require("../interfaces/user");
const User = userModel_1.default;
const RefreshToken = refreshTokenModel_1.default;
const redisClient = new ioredis_1.default(process.env.REDIS_URL);
const registerUser = async (req, res) => {
    try {
        const parsedData = (0, validation_1.registerValidation)(req.body);
        const existingUser = await User.findOne({ email: parsedData.email });
        if (existingUser) {
            res.status(401).json({
                success: false,
            });
            return;
        }
        const newUser = await User.create(parsedData);
        const { accessToken, refreshToken } = await (0, createTokens_1.default)(newUser);
        if (newUser) {
            const result = {
                data: [{
                        accessToken,
                        refreshToken,
                    }],
                curentPage: 1,
                totalPage: 1,
                totalItems: 1,
            };
            res.status(201).json({
                success: true,
                result
            });
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
        });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const parsedData = (0, validation_1.loginValidation)(req.body);
        const existedUser = await User.findOne({ email: parsedData.email });
        if (existedUser === null || existedUser === undefined) {
            res.status(404).json({
                success: false,
            });
            return;
        }
        const isPasswordMatch = await existedUser.comparePassword(parsedData.password);
        if (!isPasswordMatch) {
            res.status(401).json({
                success: false,
            });
            return;
        }
        const { refreshToken, accessToken } = await (0, createTokens_1.default)(existedUser);
        const result = {
            data: [{
                    accessToken,
                    refreshToken,
                }],
            curentPage: 1,
            totalPage: 1,
            totalItems: 1,
        };
        res.status(201).json({
            success: true,
            result
        });
    }
    catch (error) {
        res.status(500).json({
            success: false
        });
    }
};
exports.loginUser = loginUser;
const logoutUser = async (req, res) => {
    try {
        const { refreshToken } = (0, validation_1.logoutValidation)(req.body);
        if (!refreshToken) {
            res.status(404).json({
                success: false,
            });
        }
        await RefreshToken.deleteOne({ token: refreshToken });
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
exports.logoutUser = logoutUser;
const refreshTokens = async (req, res) => {
    try {
        const refreshToken = req.headers.authorization?.split(' ')[1] || null;
        if (!refreshToken) {
            res.status(401).json({
                success: false,
            });
        }
        const storedToken = await RefreshToken.findOne({ token: refreshToken });
        if (!storedToken || storedToken.expiresAt < new Date()) {
            res.status(401).json({
                success: false,
            });
        }
        const user = await User.findById(storedToken.user);
        if (!user) {
            res.status(404).json({
                success: false,
            });
        }
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await (0, createTokens_1.default)(user);
        await RefreshToken.deleteOne({ id: storedToken._id });
        const result = {
            data: [{
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                }],
            curentPage: 1,
            totalPage: 1,
            totalItems: 1,
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
exports.refreshTokens = refreshTokens;
const getUsers = async (req, res) => {
    try {
        const userRole = req.headers['x-user-role'];
        const flag = req.query.flag;
        const page = +(req.query.page || 1);
        const limit = +(req.query.limit || 7);
        const startIndex = (page - 1) * limit;
        if (!userRole) {
            res.status(401).json({
                success: false,
            });
            return;
        }
        if (userRole !== user_1.Roles.SUPERADMIN) {
            res.status(401).json({
                success: false,
            });
            return;
        }
        const users = flag === flags_1.PROFILE_FLAGS.CREATE ? await User.find({}).where({ isAuthUpprove: false })
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit) : await User.find({}).where({ isAuthUpprove: true })
            .sort({ createdAt: -1 })
            .skip(startIndex)
            .limit(limit);
        const totalNumberOfUsers = flag === flags_1.PROFILE_FLAGS.CREATE ? await User.countDocuments().where({ isAuthUpprove: false }) : await User.countDocuments().where({ isAuthUpprove: true });
        const result = {
            data: users || [],
            curentPage: page,
            totalPage: Math.ceil(totalNumberOfUsers / limit),
            totalItems: totalNumberOfUsers,
        };
        res.status(200).json({
            success: true,
            result,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
        });
    }
};
exports.getUsers = getUsers;
const upproveAuth = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({
                success: false,
            });
            return;
        }
        user.isAuthUpprove = true;
        await user.save();
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
exports.upproveAuth = upproveAuth;
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndDelete(userId);
        await RefreshToken.deleteOne({ user: userId });
        const publisher = redisClient.duplicate();
        publisher.publish('user.delete', JSON.stringify({ userId }));
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
exports.deleteUser = deleteUser;
