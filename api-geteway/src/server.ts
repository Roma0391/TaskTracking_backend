import dotenv from 'dotenv'
import express from 'express';
import cors from 'cors'
import proxy, { ProxyOptions } from 'express-http-proxy'
import validateToken, { IRequestWithUser } from './middlewares/auth-middleware';
import { RequestOptions } from 'https';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

const proxyOptions: ProxyOptions = {
  proxyReqPathResolver: (req ) => {
    return req.originalUrl.replace(/^\/api-geteway/, "");
  },
  proxyErrorHandler: (err, res, next) => {
    res.status(500).json({
      success: false,
      message: "Proxy server error",
    });
    return;
  },
};

interface IRequestOptions extends RequestOptions {
  user?: {
    user_id: string,
    user_role: string,
  }
}
app.use(
  `/api-geteway/auth`,
  validateToken,
  proxy(process.env.AUTH_SERVICE_HOST as string, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts: IRequestOptions, srcReq: IRequestWithUser) => {
      if(proxyReqOpts.headers && srcReq.user?.user_id) {
        proxyReqOpts.headers = {
          ...proxyReqOpts.headers,
          "x-user-id": srcReq.user?.user_id,
          "x-user-role": srcReq.user?.user_role
        }
      }     
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      return proxyResData;
    },
    
  }),
);

app.listen(PORT, () => {
  console.log(`Api-geteway started on port ${PORT}`);
  console.log(`Auth-service started on ${process.env.AUTH_SERVICE_HOST}`);  
})