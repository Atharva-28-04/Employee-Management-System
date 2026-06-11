import express from 'express';

import {
  applyLeave,
  getMyLeaves,
  getPendingLeaves,
  managerApproveLeave,
  managerRejectLeave,
  hrApproveLeave,
  hrRejectLeave,
  getLeaveStats,
  getLeaveTypes,
  getLeaveBalances
} from '../controllers/leaveController.js';

const router = express.Router();

// ==========================================
// EMPLOYEE
// ==========================================

// Apply Leave
router.post('/apply', applyLeave);

// View My Leaves
router.get('/my-leaves', getMyLeaves);

// Leave Stats
router.get('/stats', getLeaveStats);

// Get Leave Types
router.get('/types', getLeaveTypes);

// Get User Leave Balances
router.get('/balances', getLeaveBalances);

// ==========================================
// MANAGER / HR
// ==========================================

// View Pending Leaves
router.get('/pending', getPendingLeaves);

// Manager Approval
router.put('/:id/manager-approve', managerApproveLeave);

// Manager Rejection
router.put('/:id/manager-reject', managerRejectLeave);

// HR Final Approval
router.put('/:id/hr-approve', hrApproveLeave);

// HR Final Rejection
router.put('/:id/hr-reject', hrRejectLeave);

export default router;