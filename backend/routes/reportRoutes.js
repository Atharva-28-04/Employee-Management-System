import express from 'express';

import {
  employeeReport,
  leaveReport,
  assetReport,
  attendanceReport
} from '../controllers/reportController.js';

const router = express.Router();

router.get('/employees', employeeReport);

router.get('/leaves', leaveReport);

router.get('/assets', assetReport);

router.get('/attendance', attendanceReport);

export default router;