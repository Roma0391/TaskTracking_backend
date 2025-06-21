import mongoose, { CallbackError, Error } from 'mongoose';
import argon2 from 'argon2';

const UserSchema = new mongoose.Schema({
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
	},
	// admin_id: {
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	path: 'User',
	// },
	// project: {
	// 	type: String,
	// },
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

UserSchema.methods.comparePassword = async function( password: string) {
	try{
		if(this) {
			return await argon2.verify(this.password, password);
		}
	}catch(error){
		throw error;
	}
}

UserSchema.index({name: 'text'});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;