import express from 'express';

import {
  employeeReport,
  leaveReport,
  assetReport
} from '../controllers/reportController.js';

const router = express.Router();

router.get('/employees', employeeReport);

router.get('/leaves', leaveReport);

router.get('/assets', assetReport);

export default router;