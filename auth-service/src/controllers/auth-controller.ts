import { Request, RequestHandler, Response } from 'express';
import User from '../db/userModel';
import { loginValidation, registerValidation } from '../utils/validation'
import createTokens from '../utils/createTokens';
import { success } from 'zod/v4';
import { log } from 'console';
import RefreshToken from '../db/refreshTokenModel';


const registerUser = async (req: Request, res: Response) => {
	try{
		const parsedData = registerValidation(req.body);
		const existingUser = await User.findOne({email: parsedData.email})
		if(existingUser) {
			res.status(401).json({
				success: false,
				message: 'User olready exists'
			})
		}
		const newUser = await User.create(parsedData);
		const {accessToken, refreshToken} = await createTokens(newUser);

		if(newUser){
		
			res.status(201).json({
				success: true,
				message: 'User created successfuly',
				data: newUser,
				accessToken,
				refreshToken,
			})
		}
	}catch(error){
		res.status(500).json({
			success: false,
			message: 'Internal server error occured'
		})
	}
}

const loginUser = async (req: Request, res: Response) => {
	try{
		const parsedData = loginValidation(req.body);
		
		const existedUser = await User.findOne({email: parsedData.email});

		if(!existedUser) {
			res.status(404).json({
				success: false,
				message: 'User not found'
			})
		};
		
		const isPasswordMatch = await existedUser.comparePassword(parsedData.password);

		if(!isPasswordMatch) {
			res.status(401).json({
				success: false,
				message: 'Invalid password'
			})
		}
		const {refreshToken, accessToken} = await createTokens(existedUser);
		res.status(200).json({
			success: true,
			message: 'User logined successfully',
			data: existedUser,
			refreshToken,
			accessToken,
		})
	}catch(error){
		res.status(500).json({
			success: false,
			message: 'Internal server error occured'
		})
	}
} 

const logoutUser = async (req: Request, res: Response) => {
	try{
		const {refreshToken} = req.body;
		if(!refreshToken){
			res.status(400).json({
				success: false,
				message: 'Refresh token missing'
			})
		}
		await RefreshToken.deleteOne({token: refreshToken});
		res.status(200).json({
			success: true,
			message: 'logged out successfully'
		})
	}catch(error){
		res.status(500).json({
			success: false,
			message: 'Internal server error occured'
		})
	}
}

const refreshTokens = async (req: Request, res: Response) => {
	try{
		const {refreshToken} = req.body;
		if(!refreshToken) {
			res.status(400).json({
				success: false,
				message: 'Refresh token missing'
			})
		}
		const storedToken = await RefreshToken.findOne({token: refreshToken});
		if(!storedToken || storedToken.expiresAt < new Date()) {
			res.status(400).json({
				success: false,
				message: 'Invalide refresh token on expires data ended'
			})
		}
		const user = await User.findById(storedToken.user);
		if(!user) {
			res.status(401).json({
				success: false,
				message: 'User not found'
			})
		}
		const {accessToken: newAccessToken, refreshToken: newRefreshToken} = await createTokens(user);
		await RefreshToken.deleteOne({id: storedToken._id});
		res.status(200).json({
			success: true,
			message: 'Tokens updated successfully',
			accessToken: newAccessToken,
			refreshToken: newRefreshToken,
		})
	}catch(error){
		res.status(500).json({
			success: false,
			message: 'Internal server error occured'
		})
	}
}

export {registerUser, loginUser, logoutUser, refreshTokens};