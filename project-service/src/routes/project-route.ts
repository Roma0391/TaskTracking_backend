import { createProfile, editProfile, fetchMyProfile, fetchProfilesByProjectCreators } from '../controllers/profile-controller';
import { addUserToProject, createProject, getAllProjects, joinProject, quitProject, deleteProject, removeProfilefromProject } from '../controllers/project-controller';

const express = require('express');
const router = express.Router();

router.post('/create', createProject);
router.put('/join/:projectId', joinProject)
router.put('/quit/:projectId', quitProject)
router.put('/add/:projectId', addUserToProject)
router.put('/remove/:projectId', removeProfilefromProject)
router.delete('/delete/:projectId', deleteProject)
router.get('/fetch', getAllProjects);

router.post('/profile/create', createProfile);
router.put('/profile/edit', editProfile);
router.get('/profile/fetch/my', fetchMyProfile);
router.get('/profile/fetch/by-project', fetchProfilesByProjectCreators)

export default router;

