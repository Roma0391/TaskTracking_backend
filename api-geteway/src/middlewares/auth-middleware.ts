import jwt, { JwtPayload } from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express'

interface IUserJWTData extends JwtPayload {
	user_id: string,
	user_role: string,
	profileCreatedBy: string,
	user_firstName: string,
	user_lastName: string,
}

const validateToken = async (req: Request, res: Response, next: NextFunction) => {
	if(req.path === '/register' || req.path === '/refresh-tokens' || req.path === '/login' || req.path === '/logout') {
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
		
		if(req.path === '/current-user') {			
			res.status(200).json({
				success: true,
				result: {
					data: [{
						userId: user.user_id,
						userRole: user.user_role,
						profileCreatedBy: user.profileCreatedBy,
						userFirstName: user.user_firstName,
						userLastName: user.user_lastName,
					}],
					curentPage: 1,
					totalPage: 1,
					totalItems: 1,
				}
			})
		} else {
			req.headers = {
				...req.headers,
				'x-user-id': user.user_id,
				'x-user-role': user.user_role,
			}
			next();
		}
	}catch(error){
		res.status(500).json({
			success: false,
		})
		return;
	}
}

export default validateToken;