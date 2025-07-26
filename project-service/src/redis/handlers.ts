import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const redisHandlers = (channel: string, message: string) => {
	switch(channel) {
		case 'user.delete':
			deleteProfile(message);
			break;
	}
}

const deleteProfile = async (message: string) => {
	const {userId} = JSON.parse(message);
	await prisma.profile.delete({
		where: {
			userId
		}
	})
}
