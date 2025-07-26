import { Request, Response } from 'express';
import User, { IUserFromDB } from '../db/userModel';
import { loginValidation, logoutValidation, registerValidation } from '../utils/validation'
import createTokens from '../utils/createTokens';
import RefreshToken, { IRefreshTokenFromDb } from '../db/refreshTokenModel';
import Redis from 'ioredis'

const redisClient = new Redis(process.env.REDIS_URL as string);

const registerUser = async (req: Request, res: Response) => {
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

const loginUser = async (req: Request, res: Response) => {
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
		const {refreshToken, accessToken} = await createTokens(existedUser!);
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

const logoutUser = async (req: Request, res: Response) => {
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

const refreshTokens = async (req: Request, res: Response) => {
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

const getUsers = async (req: Request, res: Response) => {
	try{
		const userRole = req.headers['x-user-role'];
		const flag = req.query.flag;
		const page = +(req.query.page || 1);
		const limit = +(req.query.limit || 7);
		const startIndex = (page - 1) * limit;
		// const catchKey = `posts:${page}:${limit}`;
		if(!userRole) {
			res.status(401).json({
				success: false,
			})
			return
		}
		if(userRole !== 'superAdmin') {
			res.status(401).json({
				success: false,
			})
			return
		}
		const users: IUserFromDB[] | null = flag === 'Create' ? await User.find({}).where({profileCreatedBy: null})
			.sort({ createdAt: -1 })
      		.skip(startIndex)
      		.limit(limit) : await User.find({}).where('profileCreatedBy').ne(null)
			.sort({ createdAt: -1 })
      		.skip(startIndex)
      		.limit(limit);
		const totalNumberOfUsers = flag === 'Create' ? await User.countDocuments().where({profileCreatedBy: null}) : await User.countDocuments().where('profileCreatedBy').ne(null);
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

const deleteUser = async (req: Request, res: Response) => {
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

export {registerUser, loginUser, logoutUser, refreshTokens, getUsers, deleteUser};