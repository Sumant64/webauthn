import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import authRoute from './routes/authRoutes';

// Load environment variables
dotenv.config();

// Initialize Express app
const app: Express = express();

// Middleware
app.use(cookieParser());
app.use(express.json());

// CORS configuration
const CLIENT_URL: string = process.env.CLIENT_URL || 'http://localhost:3000';
app.use(cors({ origin: CLIENT_URL, credentials: true }));

// Constants
const RP_ID: string = 'localhost';
const port: number = parseInt(process.env.PORT || '4000', 10);

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoute);

// Start server
app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
});