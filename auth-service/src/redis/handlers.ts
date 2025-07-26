import User from '../db/userModel';


export const redisHandlers = async (channel: string, message: string) => {
	switch(channel) {
		case 'profile.create':
			updateUserProfileAuthor(message);
			break;
	}
}

async function updateUserProfileAuthor(message: string) {
	const {userId, createdBy} = JSON.parse(message);
	await User.findByIdAndUpdate(userId, {
		profileCreatedBy: createdBy
	});
}