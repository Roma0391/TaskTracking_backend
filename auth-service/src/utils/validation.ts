import {z} from 'zod/v4';

const RegisterSchema = z.object({
		name: z.string().min(2, {message: 'name should be at least 2 char'}),
		email: z.email({message: 'Please, enter real email'}),
		password: z.string().min(6, {message: 'Password should be at least 6 char'}),
		role: z.enum(['user', 'admin']),
});

type RegisterType = z.infer<typeof RegisterSchema>;

const LoginSchema = z.object({
	email: z.email({message: 'Please, enter real email'}),
	password: z.string().min(6, {message: 'Password should be at least 6 char'}),
})

type LoginType = z.infer<typeof LoginSchema>;

const registerValidation = (data: RegisterType) => {
	return RegisterSchema.parse(data);
}

const loginValidation = (data: LoginType) => {
	return LoginSchema.parse(data);
}

export {registerValidation, loginValidation};