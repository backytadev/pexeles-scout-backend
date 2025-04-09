import express, { Express } from 'express';

import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { connectDB } from './config/db';
import { corsConfig } from './config/cors';

import authRoutes from './routes/authRoutes';
import { createSuperUser } from './utils/create-super-user';

dotenv.config();
connectDB();

const app: Express = express();
app.use(cors(corsConfig)); // config cors

//* Logging
app.use(morgan('dev'));

//* Read form data
app.use(express.json());

//* Routes
app.use('/api/auth', authRoutes);

//* Create SuperUser
createSuperUser();

export default app;
