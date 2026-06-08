import express from 'express';
import cors from 'cors';
import 'dotenv/config'; // Handles environment variables automatically
import path from 'path';
import { fileURLToPath } from 'url';


// Route Imports
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import employeeRoutes from './routes/employeeRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import masterRoutes from './routes/masterRoutes.js';
import leaveRoutes from './routes/leaveRoutes.js';

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

// API Routes Base Configuration
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/employees/upload', uploadRoutes);
app.use('/api', masterRoutes); // Mounts /api/departments and /api/skills cleanly
app.use('/api/leaves', leaveRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});