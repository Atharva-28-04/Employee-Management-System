import express from 'express';
import {
  clockIn,
  clockOut,
  getTodayAttendance,
  getMyAttendance,
  getAttendanceStats,
  getAllAttendance,
  manualAttendance
} from '../controllers/attendanceController.js';

const router = express.Router();

// ==========================================
// EMPLOYEE ENDPOINTS
// ==========================================
router.post('/clock-in', clockIn);
router.post('/clock-out', clockOut);
router.get('/today', getTodayAttendance);
router.get('/my-attendance', getMyAttendance);
router.get('/stats', getAttendanceStats);

// ==========================================
// HR ENDPOINTS
// ==========================================
router.get('/all', getAllAttendance);
router.post('/manual', manualAttendance);

export default router;
