import mongoose from 'mongoose';
import argon2 from 'argon2';
import { IUser } from '../../../interfaces/user';

const UserSchema = new mongoose.Schema({
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