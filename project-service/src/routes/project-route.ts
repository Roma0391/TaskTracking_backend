
import { createCandidate, getCandidatesByAdminId, removeCandidate } from '../controllers/candidate-controller';
import { createProfile, editProfile, fetchMyProfile, getMembersByAdminId } from '../controllers/profile-controller';
import { createProject, getAllProjects, joinProject, quitProject, deleteProject, removeProfilefromProject, getProjectById, updateProjectOption } from '../controllers/project-controller';
import { addTodoUser, createTask, updateTaskLevel, fetchTaskById, createSubtask, finishTask } from '../controllers/task-controller';
import express from 'express';
const router = express.Router();

router.post('/create', createProject);
router.put('/update/:projectId', updateProjectOption);
router.put('/join/:projectId', joinProject);
router.put('/quit/:projectId', quitProject);
// router.put('/add/:projectId', addUserToProject);
router.put('/remove/:projectId', removeProfilefromProject);
router.delete('/delete/:projectId', deleteProject);
router.get('/fetch', getAllProjects);
router.get('/fetch/:projectId', getProjectById);

router.post('/profile/create', createProfile);
router.put('/profile/edit/:profileId', editProfile);
router.get('/profile/fetch/my/:projectId', fetchMyProfile);

router.post('/candidate/create/:projectId', createCandidate);
router.get('/candidate/fetch', getCandidatesByAdminId);
router.delete('/candidate/:candidateId', removeCandidate);

router.get('/member/fetch', getMembersByAdminId); 

router.post('/task/create', createTask);
router.put('/task/update/:taskId', updateTaskLevel);
router.put('/task/addUser/:taskId', addTodoUser);
router.put('/task/finish/:taskId', finishTask);
router.get('/task/fetch/:taskId', fetchTaskById);
router.post('/task/create-sub/:taskId', createSubtask);

export default router;

