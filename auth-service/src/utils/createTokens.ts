import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import RefreshTokenModel from '../db/refreshTokenModel';
import { Model } from 'mongoose';
import { IUserFromDB } from '../interfaces/user';

interface ICreatedTokens {
	accessToken: string,
	refreshToken: string
}

const RefreshToken = RefreshTokenModel as Model<ICreatedTokens>

const createTokens = async (user: IUserFromDB): Promise<ICreatedTokens> => {
	const jwtBody = {
		user_id: user._id,
		user_role: user.role,
		isAuthUpprove: user.isAuthUpprove,
		user_firstName: user.firstName,
		user_lastName: user.lastName,
	}
	const accessToken = jwt.sign(jwtBody, process.env.JWT_SECRET as string, {expiresIn: '24h'});
	const refreshToken = crypto.randomBytes(40).toString("hex");
	const expiresAt = new Date();

	expiresAt.setDate(expiresAt.getDate() + 7);
	await RefreshToken.create({
		token: refreshToken,
		user: user._id,
		expiresAt,
	})

	return {accessToken, refreshToken};
}

export default createTokens;