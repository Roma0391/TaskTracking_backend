import z from 'zod/v4';
import { ProfilePermissions } from '../interfaces/profile';
import { ProjectPriorityLevel } from '../interfaces/project';
import { TaskPriorityLevel } from '../interfaces/task';

const CreateProfileSchema = z.object({
  userId: z.string().nonempty({ message: 'User ID cannot be empty' }),
  firstName: z.string().min(2, { message: 'First name should be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name should be at least 2 characters' }),
  email: z.email({ message: 'Please, enter a valid email' }),
  role: z.enum(['user', 'admin']),
  permisionStatus: z.enum(ProfilePermissions),
  projectId: z.string().optional()
});

const CreateCandidateSchema = z.object({
  userId: z.string().nonempty({ message: 'User ID cannot be empty' }),
  firstName: z.string().min(2, { message: 'First name should be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name should be at least 2 characters' }),
  email: z.email({ message: 'Please, enter a valid email' }),
  createdById: z.string().nonempty({ message: 'Admin ID cannot be empty' }),
});

const CreateProjectSchema = z.object({
  name: z.string().min(2, {message: 'name should be at least 2 char'}),
	description: z.string().min(10, {message: 'Description should be at least 10 char'}),
	priorityLevel: z.enum(ProjectPriorityLevel),
});

const CreateTaskSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
  deadline: z.string(),
  priorityLevel: z.enum(TaskPriorityLevel),
  toDoProfileId: z.string().optional(),
  parentTaskId: z.string().optional(),
  projectId: z.string().nonempty({ message: 'Project ID is required' }),
})

const CreateSubtaskSchema = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().optional(),
  deadline: z.string(),
  priorityLevel: z.enum(TaskPriorityLevel),
  projectId: z.string().nonempty({ message: 'Project ID is required' }),
  parentTaskId: z.string().nonempty({ message: 'Parent Task ID is required' }),
  toDoProfileId: z.string().nonempty({ message: 'To Do Profile ID is required' }),
})
 
type CreateProfileDataType = z.infer<typeof CreateProfileSchema>;
type CreateCandidateDataType = z.infer<typeof CreateCandidateSchema>;
type CreateProjectDataType = z.infer<typeof CreateProjectSchema>;
type CreateTaskDataType = z.infer<typeof CreateTaskSchema>;
type CreateSubtaskDataType = z.infer<typeof CreateSubtaskSchema>;

export const createProfileValidation = (data: CreateProfileDataType) => {
  return CreateProfileSchema.parse(data);
};

export const createCandidateValidation = (data: CreateCandidateDataType) => {
  return CreateCandidateSchema.parse(data);
};

export const createProjectValidation = (data: CreateProjectDataType) => {
  return CreateProjectSchema.parse(data);
};

export const createTaskValidation = (data: CreateTaskDataType) => {
  return CreateTaskSchema.parse(data);
}

export const createSubtaskValidation = (data: CreateSubtaskDataType) => {
  return CreateSubtaskSchema.parse(data);
};