import express, { Router } from 'express';
import { getCurrentUser, loginUser, logoutUser, refreshTokens, registerUser } from '../controllers/auth-controller';

const router: Router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/refresh-tokens', refreshTokens);
router.get('/current-user', getCurrentUser);

export default router;