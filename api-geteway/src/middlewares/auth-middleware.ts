import jwt, { JwtPayload } from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express'

interface IUserJWTData extends JwtPayload {
	user_id: string,
	user_role: string,
}

export interface IAuthRequest extends Request {
	user?: IUserJWTData
}

const validateToken = (req: IAuthRequest, res: Response, next: NextFunction) => {
	const {accessToken} = req.body;
	if(!accessToken) {
		res.status(401).json({
				success: false,
				message: 'Access token missing'
		})
		return;
	}
	try{
		const user = jwt.verify(accessToken, process.env.JWT_SECRET as string) as IUserJWTData;
		req.user = user;
		next();
	}catch(error){
		res.status(429).json({
			success: false,
			message: 'Invalid access token',
		})
	}
}

export default validateToken;