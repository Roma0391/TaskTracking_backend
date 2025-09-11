"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateToken = async (req, res, next) => {
    if (req.path === '/register' || req.path === '/refresh-tokens' || req.path === '/login' || req.path === '/logout') {
        next();
        return;
    }
    const accessToken = req.headers.authorization?.split(' ')[1] || null;
    if (!accessToken) {
        res.status(401).json({
            success: false,
            message: 'Access token missing'
        });
        return;
    }
    try {
        const user = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET);
        if (req.path === '/current-user') {
            res.status(200).json({
                success: true,
                result: {
                    data: [{
                            userId: user.user_id,
                            userRole: user.user_role,
                            isAuthUpprove: user.isAuthUpprove,
                            userFirstName: user.user_firstName,
                            userLastName: user.user_lastName,
                        }],
                    curentPage: 1,
                    totalPage: 1,
                    totalItems: 1,
                }
            });
        }
        else {
            req.headers = {
                ...req.headers,
                'x-user-id': user.user_id,
                'x-user-role': user.user_role,
            };
            next();
        }
    }
    catch (error) {
        res.status(500).json({
            success: false,
        });
        return;
    }
};
exports.default = validateToken;
