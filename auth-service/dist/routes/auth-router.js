"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth-controller");
const router = express_1.default.Router();
router.post('/register', auth_controller_1.registerUser);
router.post('/login', auth_controller_1.loginUser);
router.post('/logout', auth_controller_1.logoutUser);
router.get('/refresh-tokens', auth_controller_1.refreshTokens);
router.get('/users', auth_controller_1.getUsers);
router.get('/upprove/:userId', auth_controller_1.upproveAuth);
router.delete('/user/:userId', auth_controller_1.deleteUser);
exports.default = router;
