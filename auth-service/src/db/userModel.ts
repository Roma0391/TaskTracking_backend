import mongoose from 'mongoose';
import argon2 from 'argon2';

export enum Role {
	ADMIN = 'admin',
	USER = 'user',
}

interface IUser {
	name: string,
	email: string,
	password: string,
	role: Role,
}

export interface IUserFromDB extends IUser {
	_id: string,
	createdAt: Date,
	updatedAt: Date,
	comparePassword(password: string): boolean
}

const UserSchema = new mongoose.Schema<IUser>({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true,
	},
	password: {
		type: String,
		required: true,
		trim: true,
	},
	role: {
		type: String,
		required: true,
	}
}, {timestamps: true});

UserSchema.pre('save', async function(next) {
	if(this && this.isModified('password')){
		try{
			this.password = await argon2.hash(this.password);
			next();
		}catch(error){
			throw error;
		}
	}
});

UserSchema.methods.comparePassword = async function( password: string): Promise<boolean> {
	return await argon2.verify(this.password, password);
}

UserSchema.index({name: 'text'});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;