import jwt, { JwtPayload } from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express'

interface IUserJWTData extends JwtPayload {
	user_id: string,
	user_role: string,
}

export interface IRequestWithUser extends Request {
	user?: IUserJWTData
}

const validateToken = async (req: IRequestWithUser, res: Response, next: NextFunction) => {
	if(req.path === '/register' || req.path === '/refresh-tokens' || req.path === '/login') {
		next();
		return;
	}
	const accessToken = req.headers.authorization?.split(' ')[1] || null;
	if(!accessToken) {
		res.status(401).json({
			success: false,
			message: 'Access token missing'
		})
		return;
	}
	try {
		const user = jwt.verify(accessToken, process.env.JWT_SECRET as string) as IUserJWTData;
		req.user = user;
		next();
	}catch(error){
		res.status(429).json({
			success: false,
			message: 'Invalid access token',
		})
		return;
	}
}

export default validateToken;