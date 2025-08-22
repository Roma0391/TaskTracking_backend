import mongoose from 'mongoose';
import { IUserFromDB } from '../../../interfaces/user';

interface IRefreshToken {
	token: string,
	user: IUserFromDB,
	expiresAt: Date
}

export interface IRefreshTokenFromDb extends IRefreshToken {
	_id: string,
	createdAt: Date,
	updatedAt: Date,
}

const RefreshTokenSchema = new mongoose.Schema<IRefreshToken>({
	token: {
		type: String,
		require: true,
		unique: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		require: true,
	},
	
	expiresAt: {
		type: Date,
		require: true,
	}
}, {timestamps: true});

const RefreshToken = mongoose.models.RefreshToken || mongoose.model("RefreshToken", RefreshTokenSchema);

export default RefreshToken;

