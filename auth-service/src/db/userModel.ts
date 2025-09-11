import mongoose, { Schema } from 'mongoose';
import argon2 from 'argon2';
import { Roles } from '../interfaces/user';

export interface IUserSchema extends mongoose.Document {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	role: Roles;
	isAuthUpprove: boolean;
}

const UserSchema = new Schema<IUserSchema>({
	firstName: {
		type: String,
		required: true,
		trim: true,
	},
	lastName: {
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
	},
	isAuthUpprove: {
		type: Boolean,
		default: false,
		require: true,
	}
}, {timestamps: true});

UserSchema.pre('save', async function(next) {
	if(this && this.isModified('password')){
		try{
			this.password = await argon2.hash(this.password as string);
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

const User = mongoose.models.User || mongoose.model<IUserSchema>('User', UserSchema);

export default User;