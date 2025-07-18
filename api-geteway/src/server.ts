import dotenv from 'dotenv'
import express from 'express';
import cors from 'cors'
import proxy, { ProxyOptions } from 'express-http-proxy'
import validateToken from './middlewares/auth-middleware';

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
app.use(
  `/api-geteway/auth`,
  validateToken,
  proxy(process.env.AUTH_SERVICE_HOST as string, {
    ...proxyOptions,
  }),
);

app.use(
  `/api-geteway/project`,
  validateToken,
  proxy(process.env.PROJECT_SERVICE_HOST as string, {
    ...proxyOptions,
  }),
);

app.listen(PORT, () => {
  console.log(`Api-geteway started on port ${PORT}`);
  console.log(`Auth-service started on ${process.env.AUTH_SERVICE_HOST}`);  
  console.log(`Project-service started on ${process.env.PROJECT_SERVICE_HOST}`);  
})