export enum Roles {
	USER = 'user',
	ADMIN = 'admin',
	SUPERADMIN = 'superAdmin'
}

export interface Tokens {
	accessToken: string,
	refreshToken: string,
}

export interface IUser {
	userId: string,
	userRole: Roles,
	isAuthUpprove: boolean,
	userFirstName: string,
	userLastName: string,
}

export interface IUserFromDB {
	_id: string,
	firstName: string,
	lastName: string,
	email: string,
	password: string,
	role: Roles,
	isAuthUpprove: boolean,
	createdAt: string,
	updatedAt: string,
	comparePassword: (password: string) => boolean
}