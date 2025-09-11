"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubtaskValidation = exports.createTaskValidation = exports.createProjectValidation = exports.createCandidateValidation = exports.createProfileValidation = void 0;
const v4_1 = __importDefault(require("zod/v4"));
const profile_1 = require("../interfaces/profile");
const project_1 = require("../interfaces/project");
const task_1 = require("../interfaces/task");
const CreateProfileSchema = v4_1.default.object({
    userId: v4_1.default.string().nonempty({ message: 'User ID cannot be empty' }),
    firstName: v4_1.default.string().min(2, { message: 'First name should be at least 2 characters' }),
    lastName: v4_1.default.string().min(2, { message: 'Last name should be at least 2 characters' }),
    email: v4_1.default.email({ message: 'Please, enter a valid email' }),
    role: v4_1.default.enum(['user', 'admin']),
    permisionStatus: v4_1.default.enum(profile_1.ProfilePermissions),
    projectId: v4_1.default.string().optional()
});
const CreateCandidateSchema = v4_1.default.object({
    userId: v4_1.default.string().nonempty({ message: 'User ID cannot be empty' }),
    firstName: v4_1.default.string().min(2, { message: 'First name should be at least 2 characters' }),
    lastName: v4_1.default.string().min(2, { message: 'Last name should be at least 2 characters' }),
    email: v4_1.default.email({ message: 'Please, enter a valid email' }),
    createdById: v4_1.default.string().nonempty({ message: 'Admin ID cannot be empty' }),
});
const CreateProjectSchema = v4_1.default.object({
    name: v4_1.default.string().min(2, { message: 'name should be at least 2 char' }),
    description: v4_1.default.string().min(10, { message: 'Description should be at least 10 char' }),
    priorityLevel: v4_1.default.enum(project_1.ProjectPriorityLevel),
});
const CreateTaskSchema = v4_1.default.object({
    title: v4_1.default.string().min(1, { message: 'Title is required' }),
    description: v4_1.default.string().optional(),
    deadline: v4_1.default.string(),
    priorityLevel: v4_1.default.enum(task_1.TaskPriorityLevel),
    toDoProfileId: v4_1.default.string().optional(),
    parentTaskId: v4_1.default.string().optional(),
    projectId: v4_1.default.string().nonempty({ message: 'Project ID is required' }),
});
const CreateSubtaskSchema = v4_1.default.object({
    title: v4_1.default.string().min(1, { message: 'Title is required' }),
    description: v4_1.default.string().optional(),
    deadline: v4_1.default.string(),
    priorityLevel: v4_1.default.enum(task_1.TaskPriorityLevel),
    projectId: v4_1.default.string().nonempty({ message: 'Project ID is required' }),
    parentTaskId: v4_1.default.string().nonempty({ message: 'Parent Task ID is required' }),
    toDoProfileId: v4_1.default.string().nonempty({ message: 'To Do Profile ID is required' }),
});
const createProfileValidation = (data) => {
    return CreateProfileSchema.parse(data);
};
exports.createProfileValidation = createProfileValidation;
const createCandidateValidation = (data) => {
    return CreateCandidateSchema.parse(data);
};
exports.createCandidateValidation = createCandidateValidation;
const createProjectValidation = (data) => {
    return CreateProjectSchema.parse(data);
};
exports.createProjectValidation = createProjectValidation;
const createTaskValidation = (data) => {
    return CreateTaskSchema.parse(data);
};
exports.createTaskValidation = createTaskValidation;
const createSubtaskValidation = (data) => {
    return CreateSubtaskSchema.parse(data);
};
exports.createSubtaskValidation = createSubtaskValidation;
