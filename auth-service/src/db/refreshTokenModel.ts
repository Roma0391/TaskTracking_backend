import mongoose from 'mongoose';

const RefreshTokenSchema = new mongoose.Schema({
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

