import express, { Router } from 'express';
import { getUsers, loginUser, logoutUser, refreshTokens, registerUser, deleteUser, upproveAuth } from '../controllers/auth-controller';

const router: Router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/refresh-tokens', refreshTokens);
router.get('/users', getUsers);
router.get('/upprove/:userId', upproveAuth);
router.delete('/user/:userId', deleteUser);


export default router;