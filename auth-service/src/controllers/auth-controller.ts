import { PROFILE_FLAGS } from './../../../../TaskTracking_frontend/src/interfaces/flags';
import { Request, Response } from 'express';
import User from '../db/userModel';
import { loginValidation, logoutValidation, registerValidation } from '../utils/validation'
import createTokens from '../utils/createTokens';
import RefreshToken, { IRefreshTokenFromDb } from '../db/refreshTokenModel';
import Redis from 'ioredis'
import { IDataResponce } from '../../../interfaces/apiResponcesTypes';
import { IUserFromDB, Roles, Tokens } from '../../../interfaces/user';

const redisClient = new Redis(process.env.REDIS_URL as string);

export const registerUser = async (req: Request, res: Response) => {
	try{ 		
		const parsedData = registerValidation(req.body);
		const existingUser: IUserFromDB | null = await User.findOne({email: parsedData.email});
		if(existingUser) {
		    res.status(401).json({
				success: false,
			}) 
			return;
		} 
		const newUser: IUserFromDB = await User.create(parsedData);
		const {accessToken, refreshToken} = await createTokens(newUser);
		if(newUser){
			const result = {
			data: [{
				accessToken,
				refreshToken,
			}] ,
			curentPage: 1,
			totalPage: 1,
			totalItems: 1,
		};
			res.status(201).json({
				success: true,
				result
			})
		} 
	}catch(error){		
		res.status(500).json({
			success: false,
		})
	}
}

export const loginUser = async (req: Request, res: Response) => {
	try{
		const parsedData = loginValidation(req.body);
		const existedUser: IUserFromDB | null = await User.findOne({email: parsedData.email});
		if(!existedUser) {
			res.status(401).json({
				success: false,
			})
			return;
		};
		const isPasswordMatch: boolean = await existedUser.comparePassword(parsedData.password);

		if(!isPasswordMatch) {
			res.status(401).json({
				success: false,
			})
			return;
		}
		const {refreshToken, accessToken} = await createTokens(existedUser);
		const result = {
			data: [{
				accessToken,
				refreshToken,
			}] ,
			curentPage: 1,
			totalPage: 1,
			totalItems: 1,
		};
		res.status(201).json({
			success: true,
			result
		})
	}catch(error){
		res.status(500).json({
			success: false
		})
	}
} 

export const logoutUser = async (req: Request, res: Response) => {
	try{
		const {refreshToken} = logoutValidation(req.body);
		if(!refreshToken){
			res.status(404).json({
				success: false,
			})
		}
		await RefreshToken.deleteOne({token: refreshToken});
		res.status(200).json({
			success: true,
		})
	}catch(error){
		res.status(500).json({
			success: false,
		})
	}
}

export const refreshTokens = async (req: Request, res: Response) => {
	try{
		const refreshToken = req.headers.authorization?.split(' ')[1] || null;
		if(!refreshToken) {
			res.status(401).json({
				success: false,
			})
		}
		const storedToken: IRefreshTokenFromDb | null = await RefreshToken.findOne({token: refreshToken});
		if(!storedToken || storedToken.expiresAt < new Date()) {
			res.status(401).json({
				success: false,
			})
		}
		const user: IUserFromDB | null = await User.findById(storedToken!.user);
		
		if(!user) {
			res.status(404).json({
				success: false,
			})
		}
		const {accessToken: newAccessToken, refreshToken: newRefreshToken} = await createTokens(user!);
		await RefreshToken.deleteOne({id: storedToken!._id});
		const result = {
			data: [{
				accessToken: newAccessToken,
				refreshToken: newRefreshToken,
			}] ,
			curentPage: 1,
			totalPage: 1,
			totalItems: 1,
		};
		res.status(201).json({
			success: true,
			result
		})
	}catch(error){
		res.status(500).json({
			success: false,
		})
	}
}

export const getUsers = async (req: Request, res: Response) => {
	try{
		const userRole = req.headers['x-user-role'];
		const flag = req.query.flag;
		const page = +(req.query.page || 1);
		const limit = +(req.query.limit || 7);
		const startIndex = (page - 1) * limit;
		if(!userRole) {
			res.status(401).json({
				success: false,
			})
			return
		}
		if(userRole !== Roles.SUPERADMIN) {
			res.status(401).json({
				success: false,
			})
			return
		}
		const users: IUserFromDB[] | null = flag === PROFILE_FLAGS.CREATE ? await User.find({}).where({isAuthUpprove: false})
			.sort({ createdAt: -1 })
      		.skip(startIndex)
      		.limit(limit) : await User.find({}).where({isAuthUpprove: true})
			.sort({ createdAt: -1 })
      		.skip(startIndex)
      		.limit(limit);
		const totalNumberOfUsers = flag === PROFILE_FLAGS.CREATE ? await User.countDocuments().where({isAuthUpprove: false}) : await User.countDocuments().where({isAuthUpprove: true});
		const result = {
			data: users || [],
			curentPage: page,
			totalPage: Math.ceil(totalNumberOfUsers / limit),
			totalItems: totalNumberOfUsers,
		};
		res.status(200).json({
			success: true,
			result,
		})
	} catch(error) {
		res.status(500).json({
			success: false,
		})
	}
}

export const upproveAuth = async (req: Request, res: Response) => {
	try{
		const {userId} = req.params;
		const user = await User.findById(userId);
		user.isAuthUpprove = true;
		await user.save();
		res.status(201).json({
			success: true,
		})
	}catch(error){
		res.status(500).json({
			success: false,
		})
	}
}

export const deleteUser = async (req: Request, res: Response) => {
	try{
		const {userId} = req.params;
		await User.findByIdAndDelete(userId);
		await RefreshToken.deleteOne({user: userId});
		const publisher = redisClient.duplicate();
		publisher.publish('user.delete', JSON.stringify({userId}));
		res.status(201).json({
			success: true,
		})
	}catch(error){
		res.status(500).json({
			success: false,
		})
	}
} 
