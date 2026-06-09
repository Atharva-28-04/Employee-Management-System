import prisma from '../config/prismaClient.js';

// EMPLOYEE REPORT
export const employeeReport = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        user: true,
        department: true
      }
    });

    res.json(employees);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// LEAVE REPORT
export const leaveReport = async (req, res) => {
  try {
    const leaves = await prisma.leaveApplication.findMany({
      include: {
        employee: true,
        leaveType: true
      }
    });

    res.json(leaves);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// ASSET REPORT
export const assetReport = async (req, res) => {
  try {
    const assets = await prisma.asset.findMany({
      include: {
        allocations: true
      }
    });

    res.json(assets);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};