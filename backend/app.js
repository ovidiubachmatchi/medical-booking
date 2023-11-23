import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRoutes from './src/routes/authRoutes.js';
import {verifyToken} from './src/session/verifyToken.js'
import {verifyAdmin} from './src/session/verifyAdmin.js'
import appointmentsRoutes from './src/routes/appointmentsRoutes.js'
import userRoutes from './src/routes/userRoutes.js'

dotenv.config(); // setting our local env variabiles

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
    origin: 'http://localhost:8000', // frontend
    credentials: true,
};
app.use(cors(corsOptions));

app.use(cookieParser());

app.use('/auth', authRoutes);

// setting middleware
app.use('/api', verifyToken);
app.use('/api', appointmentsRoutes);

// setting middleware
app.use('/api', verifyAdmin);
app.use('/api', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serverul rulează pe portul ${PORT}`);
});

export default app;
