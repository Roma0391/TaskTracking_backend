import express, { Router, Request, Response } from 'express';
import { loginUser, logoutUser, refreshTokens, registerUser } from '../controllers/auth-controller';

const router: Router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('refresh-tokens', refreshTokens);
 

export default router;