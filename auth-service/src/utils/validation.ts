import {z} from 'zod/v4';

const RegisterSchema = z.object({
		name: z.string().min(2, {message: 'name should be at least 2 char'}),
		email: z.email({message: 'Please, enter real email'}),
		password: z.string().min(6, {message: 'Password should be at least 6 char'}),
		role: z.enum(['user', 'admin']),
});

const LoginSchema = z.object({
	email: z.email({message: 'Please, enter real email'}),
	password: z.string().min(6, {message: 'Password should be at least 6 char'}),
})

const LogoutSchema = z.object({
	refreshToken: z.string()
})

const RefreshTokenSchema = z.object({
	refreshToken: z.string()
})

type RegisterDataType = z.infer<typeof RegisterSchema>;
type LoginDataType = z.infer<typeof LoginSchema>;
type LogoutDataType = z.infer<typeof LogoutSchema>;
type RefreshTokenDataType = z.infer<typeof RefreshTokenSchema>;


export const registerValidation = (data: RegisterDataType) => {
	return RegisterSchema.parse(data);
}

export const loginValidation = (data: LoginDataType) => {
	return LoginSchema.parse(data);
}

export const logoutValidation = (data: LogoutDataType) => {
	return LogoutSchema.parse(data)
}

export const refreshTokenValidation = (data: RefreshTokenDataType) => {
	return RefreshTokenSchema.parse(data)
}