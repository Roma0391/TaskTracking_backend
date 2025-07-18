import z from 'zod/v4';

const CreateProfileSchema = z.object({
  userId: z.string().nonempty({ message: 'User ID cannot be empty' }),
  firstName: z.string().min(2, { message: 'First name should be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name should be at least 2 characters' }),
  email: z.email({ message: 'Please, enter a valid email' }),
  role: z.enum(['user', 'admin']),
  permisionStatus: z.enum(['high', 'medium', 'low']),
});

const CreateProjectSchema = z.object({
  name: z.string().min(2, {message: 'name should be at least 2 char'}),
	description: z.string().min(10, {message: 'Description should be at least 10 char'}),
	priorityLavel: z.enum(['high', 'medium', 'low']),
});
 
type CreateProfileDataType = z.infer<typeof CreateProfileSchema>;
type CreateProjectDataType = z.infer<typeof CreateProjectSchema>;

export const createProfileValidation = (data: CreateProfileDataType) => {
  return CreateProfileSchema.parse(data);
};

export const createProjectValidation = (data: CreateProjectDataType) => {
  return CreateProjectSchema.parse(data);
};
