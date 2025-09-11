"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenValidation = exports.logoutValidation = exports.loginValidation = exports.registerValidation = void 0;
const v4_1 = require("zod/v4");
const RegisterSchema = v4_1.z.object({
    firstName: v4_1.z.string().min(2, { message: 'name should be at least 2 char' }),
    lastName: v4_1.z.string().min(2, { message: 'Last name should be at least 2 char' }),
    email: v4_1.z.email({ message: 'Please, enter real email' }),
    password: v4_1.z.string().min(6, { message: 'Password should be at least 6 char' }),
    role: v4_1.z.enum(['user', 'admin']),
});
const LoginSchema = v4_1.z.object({
    email: v4_1.z.email({ message: 'Please, enter real email' }),
    password: v4_1.z.string().min(6, { message: 'Password should be at least 6 char' }),
});
const LogoutSchema = v4_1.z.object({
    refreshToken: v4_1.z.string()
});
const RefreshTokenSchema = v4_1.z.object({
    refreshToken: v4_1.z.string()
});
const registerValidation = (data) => {
    return RegisterSchema.parse(data);
};
exports.registerValidation = registerValidation;
const loginValidation = (data) => {
    return LoginSchema.parse(data);
};
exports.loginValidation = loginValidation;
const logoutValidation = (data) => {
    return LogoutSchema.parse(data);
};
exports.logoutValidation = logoutValidation;
const refreshTokenValidation = (data) => {
    return RefreshTokenSchema.parse(data);
};
exports.refreshTokenValidation = refreshTokenValidation;
