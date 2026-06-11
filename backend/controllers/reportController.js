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

// ATTENDANCE REPORT
export const attendanceReport = async (req, res) => {
  try {
    const attendance = await prisma.attendance.findMany({
      include: {
        employee: {
          include: {
            user: true,
            department: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });

    const formatted = attendance.map((record) => {
      const emp = record.employee;
      const userName = emp ? `${emp.first_name || ''} ${emp.last_name || ''}`.trim() : 'N/A';
      return {
        Date: record.date ? new Date(record.date).toISOString().split('T')[0] : 'N/A',
        Employee: userName,
        Email: emp?.user?.email || 'N/A',
        Department: emp?.department?.department_name || 'N/A',
        ClockIn: record.clock_in ? new Date(record.clock_in).toLocaleTimeString() : 'N/A',
        ClockOut: record.clock_out ? new Date(record.clock_out).toLocaleTimeString() : 'N/A',
        Status: record.status,
        TotalHours: record.total_hours ? parseFloat(record.total_hours) : 0,
        Remarks: record.remarks || ''
      };
    });

    res.json(formatted);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};