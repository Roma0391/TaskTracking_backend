import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import RefreshToken from '../db/refreshTokenModel';
import { IUserFromDB } from '../db/userModel';

interface ICreatedTokens {
	accessToken: string,
	refreshToken: string
}

const createTokens = async (user: IUserFromDB): Promise<ICreatedTokens> => {
	const jwtBody = {
		user_id: user._id,
		user_role: user.role,
	}
	const accessToken = jwt.sign(jwtBody, process.env.JWT_SECRET as string, {expiresIn: '55m'});
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