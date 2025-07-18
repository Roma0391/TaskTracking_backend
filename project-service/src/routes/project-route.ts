import { createProfile, fetchMyProfile } from '../controllers/profile-controller';
import { addUserToProject, createProject, getAllProjects, getMyProjects, joinProject } from '../controllers/project-controller';

const express = require('express');
const router = express.Router();

router.post('/create', createProject);
router.put('/join/:projectId', joinProject)
router.put('/addUser/:projectId', addUserToProject)
router.get('/fetch', getAllProjects);
router.get('/fetch/my', getMyProjects);
router.post('/profile/create', createProfile);
router.get('/profile/fetch/my', fetchMyProfile);

export default router;

