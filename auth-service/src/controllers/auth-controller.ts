import { Request, Response } from 'express';
import User, { IUserFromDB } from '../db/userModel';
import { loginValidation, logoutValidation, refreshTokenValidation, registerValidation } from '../utils/validation'
import createTokens from '../utils/createTokens';
import RefreshToken, { IRefreshTokenFromDb } from '../db/refreshTokenModel';

interface IUser {
	user_id: string,
	user_role: string,
}
 
export interface IAuthRequest extends Request {
	user?: IUser
}

const registerUser = async (req: IAuthRequest, res: Response) => {
	try{ 		
		const parsedData = registerValidation(req.body);

		const existingUser: IUserFromDB | null = await User.findOne({email: parsedData.email});
		if(existingUser) {
		    res.status(401).json({
				success: false,
				message: 'User olready exists'
			}) 
			return;
		}
		const newUser: IUserFromDB = await User.create(parsedData);
		
		const {accessToken, refreshToken} = await createTokens(newUser);
		if(newUser){
			res.status(201).json({
				success: true,
				message: 'User created successfuly',
				data: {
					id: newUser._id,
					name: newUser.name,
				},
				accessToken,
				refreshToken,
			})
		}
	}catch(error){		
		res.status(500).json({
			success: false,
			message: 'Auth service register user error occured'
		})
	}
}

const loginUser = async (req: Request, res: Response) => {
	try{
		const parsedData = loginValidation(req.body);
		const existedUser: IUserFromDB | null = await User.findOne({email: parsedData.email});
		if(!existedUser) {
			res.status(404).json({
				success: false,
				message: 'User not found'
			})
			return;
		};
		const isPasswordMatch: boolean = existedUser!.comparePassword(parsedData.password);

		if(!isPasswordMatch) {
			res.status(401).json({
				success: false,
				message: 'Invalid password'
			})
		}
		const {refreshToken, accessToken} = await createTokens(existedUser!);
		res.status(200).json({
			success: true,
			message: 'User logined successfully',
			data: {
				id: existedUser?._id,
				name: existedUser?.name,
			},
			refreshToken,
			accessToken,
		})
	}catch(error){
		res.status(500).json({
			success: false,
			message: 'Auth service login error occured'
		})
	}
} 

const logoutUser = async (req: Request, res: Response) => {
	try{
		const {refreshToken} = logoutValidation(req.body);
		if(!refreshToken){
			res.status(400).json({
				success: false,
				message: 'Refresh token missing'
			})
		}
		await RefreshToken.deleteOne({token: refreshToken});
		res.status(200).json({
			success: true,
			message: 'Logged out successfully'
		})
	}catch(error){
		res.status(500).json({
			success: false,
			message: 'Auth service logout error occured'
		})
	}
}

const refreshTokens = async (req: Request, res: Response) => {
	try{
		const {refreshToken} = refreshTokenValidation(req.body);
		if(!refreshToken) {
			res.status(400).json({
				success: false,
				message: 'Refresh token missing'
			})
		}
		const storedToken: IRefreshTokenFromDb | null = await RefreshToken.findOne({token: refreshToken});
		if(!storedToken || storedToken.expiresAt < new Date()) {
			res.status(400).json({
				success: false,
				message: 'Invalide refresh token on expires data ended'
			})
		}
		const user: IUserFromDB | null = await User.findById(storedToken!.user);
		if(!user) {
			res.status(401).json({
				success: false,
				message: 'User not found'
			})
		}
		const {accessToken: newAccessToken, refreshToken: newRefreshToken} = await createTokens(user!);
		await RefreshToken.deleteOne({id: storedToken!._id});
		res.status(200).json({
			success: true,
			message: 'Tokens updated successfully',
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
		})
	}catch(error){
		res.status(500).json({
			success: false,
			message: 'Auth service refresh tokens error occured'
		})
	}
}

export {registerUser, loginUser, logoutUser, refreshTokens};