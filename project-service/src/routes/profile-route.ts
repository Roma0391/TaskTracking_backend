import { createProfile } from '../controllers/profile-controller';

const express = require('express');
const router = express.Router();

router.post('/create', createProfile);

export default router;

