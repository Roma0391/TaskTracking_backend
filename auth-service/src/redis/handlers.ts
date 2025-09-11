import Redis from 'ioredis';
import UserModel, { IUserSchema } from '../db/userModel';
import { Model } from 'mongoose';
const redis = new Redis(process.env.REDIS_URL as string);

export const redisHandlers = async (channel: string, message: string) => {
	switch(channel) {
		case 'user.join_request':
			sendUserData(message);
			break;
	}
}

const User = UserModel as Model<IUserSchema>;

async function sendUserData(message: string) {
	const {userId} = JSON.parse(message);
	const userData = await User.findById(userId);
	const pub = redis.duplicate();
	pub.publish('user.join_response', JSON.stringify({
		userId: userData!.id,
		firstName: userData!.firstName,
		lastName: userData!.lastName,
		email: userData!.email
	}));
}