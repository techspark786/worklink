import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import serviceRoutes from './routes/serviceRoutes';
import workerRoutes from './routes/workerRoutes';
import cooperativeRoutes from './routes/cooperativeRoutes';
import bookingRoutes from './routes/bookingRoutes';
import federationRoutes from './routes/federationRoutes';
import { complaintRouter } from './routes/complaintRoutes';
import { reviewRouter } from './routes/reviewRoutes';
import aiRoutes from './routes/aiRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    app: 'WorkLink Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/cooperatives', cooperativeRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/federation', federationRoutes);
app.use('/api/complaints', complaintRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/ai', aiRoutes);

app.listen(PORT, () => {
  console.log(`🚀 [WorkLink Backend] Server running on http://localhost:${PORT}`);
});

export default app;
