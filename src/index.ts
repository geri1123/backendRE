import express, { Request, Response,ErrorRequestHandler  } from "express";
import dotenv from 'dotenv';
import cors from 'cors';
import path from "path";
import cookieParser from 'cookie-parser';
import { fileURLToPath } from 'url';
import { config } from "./config/config.js";
import errorHandler from "./middlewares/errorHandler.js";
import agencyRouter from './routes/agencyRouter.js';

import updateProfile from './routes/userRoutes.js'

import authRouter from './routes/authRoutes.js';
dotenv.config();


const app = express();
app.use(express.json());
app.use(cookieParser());



// Split CORS origins and filter out empty strings
const corsOrigins = config.server.corsOrigin
  .split(',')
  .map(origin => origin.trim())
  .filter(origin => origin.length > 0);

console.log('🌐 Allowed CORS origins:', corsOrigins);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin || corsOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.error(`❌ Blocked by CORS: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
//routes
app.use('/api/auth', authRouter);

app.use('/profile' , updateProfile)
app.use('/agencyapi' , agencyRouter)
// Health check endpoint
app.get('/', (req: Request, res: Response) => {
    res.json({ 
        message: 'Backend is running successfully!',
        port: config.server.port,
        corsOrigins: corsOrigins
    });
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
    res.json({ 
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.listen(config.server.port, () => {
    console.log(`🚀 Server running on port ${config.server.port}`);
    console.log(`📡 Health check: http://localhost:${config.server.port}/health`);
});
app.use(errorHandler as ErrorRequestHandler);
// import { detectLanguage } from "./middlewares/languagemiddleware.js";
// app.use(detectLanguage);
// app.get("/example", (req, res) => {
//   res.send(`Language is ${req.lang}`);
// });