import express, { Router } from 'express';
import { getUsers, loginUser, logoutUser, refreshTokens, registerUser, updateUserProfileAuthor } from '../controllers/auth-controller';

const router: Router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/refresh-tokens', refreshTokens);
router.put('/update-user', updateUserProfileAuthor);
router.get('/users', getUsers)

export default router;