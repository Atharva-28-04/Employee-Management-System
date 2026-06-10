import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from './middleware/errorHandler.js';
import './jobs/cronJobs.js';
// Route Imports
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import masterRoutes from './routes/masterRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';
import assetRoutes from './routes/assetRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import auditRoutes from './routes/auditRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Resolve __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Global Middleware
app.use(cors());
app.use(express.json());

// Serve static uploaded files (Images/Documents)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Health Check API
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running healthy 🚀',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ✅ API v1 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/employees/upload', uploadRoutes);
app.use('/api/v1', masterRoutes);
app.use('/api/v1/leaves', leaveRoutes);
app.use('/api/v1/assets', assetRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/audit-logs', auditRoutes);
app.use('/api/v1/reports', reportRoutes);

// Centralized Error Handler
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
  console.log(`Health check: http://localhost:${PORT}/api/v1/health`);
});