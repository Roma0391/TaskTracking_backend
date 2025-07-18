import express from 'express';
// import cors from 'cors';
import dotenv from 'dotenv';
import projectRoutes from './routes/project-route';

dotenv.config();
const app = express();
app.use(express.json());
// app.use(cors());
app.use('/project', projectRoutes);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Profile service is running on port ${PORT}`);
});