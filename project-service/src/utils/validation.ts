import z from 'zod/v4';

const CreateProfileSchema = z.object({
  userId: z.string().nonempty({ message: 'User ID cannot be empty' }),
  firstName: z.string().min(2, { message: 'First name should be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name should be at least 2 characters' }),
  email: z.email({ message: 'Please, enter a valid email' }),
  role: z.enum(['user', 'admin']),
  permissions: z.array(z.string()).optional(),
});
 
type CreateProfileDataType = z.infer<typeof CreateProfileSchema>;

export const createProfileValidation = (data: CreateProfileDataType) => {
  return CreateProfileSchema.parse(data);
};
