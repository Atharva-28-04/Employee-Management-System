import express from 'express';
import prisma from '../config/prismaClient.js';

const router = express.Router();

// ==========================================
// DASHBOARD STATS
// ==========================================
router.get('/stats', async (req, res) => {
  try {
    const employeeCount = await prisma.employee.count();
    const departmentCount = await prisma.department.count();
    const skillCount = await prisma.skill.count();
    const imageCount = await prisma.employeeDocument.count();

    res.json({
      employees: employeeCount,
      departments: departmentCount,
      skills: skillCount,
      images: imageCount
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message
    });
  }
});

// ==========================================
// EMPLOYEES BY DEPARTMENT
// ==========================================
// ==========================================
// EMPLOYEES BY DEPARTMENT
// ==========================================
router.get('/department-chart', async (req, res) => {
  try {

    const departments = await prisma.department.findMany({
      include: {
        profiles: true
      }
    });

    const chartData = departments.map((dept) => ({
      department: dept.department_name,
      employees: dept.profiles.length
    }));

    res.json(chartData);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});

// ==========================================
// LEAVE STATUS CHART
// ==========================================
router.get('/leave-chart', async (req, res) => {
  try {

    const pending = await prisma.leaveApplication.count({
      where: {
        status: 'Pending'
      }
    });

    const approved = await prisma.leaveApplication.count({
      where: {
        status: 'Approved'
      }
    });

    const rejected = await prisma.leaveApplication.count({
      where: {
        status: 'Rejected'
      }
    });

    res.json([
      {
        name: 'Pending',
        value: pending
      },
      {
        name: 'Approved',
        value: approved
      },
      {
        name: 'Rejected',
        value: rejected
      }
    ]);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});

// ==========================================
// RECENT LEAVES
// ==========================================
router.get('/recent-leaves', async (req, res) => {
  try {

    const leaves = await prisma.leaveApplication.findMany({
      take: 5,
      orderBy: {
        created_at: 'desc'
      },
      include: {
        employee: true
      }
    });

    res.json(leaves);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
});
// ==========================================
// ASSET STATS
// ==========================================
router.get('/asset-stats', async (req, res) => {
  try {
    const totalAssets = await prisma.asset.count();

    const allocatedAssets = await prisma.asset.count({
      where: {
        status: 'Allocated'
      }
    });

    const availableAssets = await prisma.asset.count({
      where: {
        status: 'Available'
      }
    });

    res.json({
      totalAssets,
      allocatedAssets,
      availableAssets
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});

// ==========================================
// NOTIFICATION COUNT
// ==========================================
router.get('/notification-count', async (req, res) => {
  try {

    const unread = await prisma.notification.count({
      where: {
        is_read: false
      }
    });

    res.json({
      unread
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: error.message
    });
  }
});



export default router;