import express from 'express';
import authRoutes from './src/routes/authRoutes.js';
import cors from 'cors';
import dotenv from 'dotenv';
import {verifyToken} from './src/session/middleware.js'
import cookieParser from 'cookie-parser';


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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serverul rulează pe portul ${PORT}`);
});

export default app;
