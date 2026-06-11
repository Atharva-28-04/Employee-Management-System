import prisma from '../config/prismaClient.js';

// ==========================================
// CLOCK IN
// ==========================================
export const clockIn = async (req, res) => {
  try {
    const { userId, remarks } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const employee = await prisma.employee.findFirst({
      where: { user_id: parseInt(userId) }
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    const localDateStr = new Date().toLocaleDateString('en-CA');
    const today = new Date(localDateStr + 'T00:00:00.000Z');

    // Check if check-in already exists
    const existing = await prisma.attendance.findUnique({
      where: {
        employee_id_date: {
          employee_id: employee.id,
          date: today
        }
      }
    });

    if (existing) {
      return res.status(400).json({ message: "You have already clocked in today" });
    }

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Late cutoff is 09:15 AM
    const isLate = (currentHour > 9) || (currentHour === 9 && currentMinute > 15);
    const status = isLate ? 'Late' : 'Present';

    const attendance = await prisma.attendance.create({
      data: {
        employee_id: employee.id,
        date: today,
        clock_in: now,
        status: status,
        remarks: remarks || null
      }
    });

    res.status(201).json({
      message: "Clock-in successful",
      attendance
    });

  } catch (error) {
    console.error("Clock In Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// CLOCK OUT
// ==========================================
export const clockOut = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const employee = await prisma.employee.findFirst({
      where: { user_id: parseInt(userId) }
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    const localDateStr = new Date().toLocaleDateString('en-CA');
    const today = new Date(localDateStr + 'T00:00:00.000Z');

    const attendance = await prisma.attendance.findUnique({
      where: {
        employee_id_date: {
          employee_id: employee.id,
          date: today
        }
      }
    });

    if (!attendance) {
      return res.status(400).json({ message: "You must clock in first before clocking out" });
    }

    if (attendance.clock_out) {
      return res.status(400).json({ message: "You have already clocked out today" });
    }

    const now = new Date();
    const diffMs = now - new Date(attendance.clock_in);
    const totalHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));

    // If total hours is less than 4, classify as Half Day
    let updatedStatus = attendance.status;
    if (totalHours < 4) {
      updatedStatus = "Half Day";
    }

    const updatedAttendance = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        clock_out: now,
        total_hours: totalHours,
        status: updatedStatus
      }
    });

    res.json({
      message: "Clock-out successful",
      attendance: updatedAttendance
    });

  } catch (error) {
    console.error("Clock Out Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// GET TODAY'S ATTENDANCE
// ==========================================
export const getTodayAttendance = async (req, res) => {
  try {
    const userId = parseInt(req.query.userId);

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const employee = await prisma.employee.findFirst({
      where: { user_id: userId }
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    const localDateStr = new Date().toLocaleDateString('en-CA');
    const today = new Date(localDateStr + 'T00:00:00.000Z');

    const attendance = await prisma.attendance.findUnique({
      where: {
        employee_id_date: {
          employee_id: employee.id,
          date: today
        }
      }
    });

    res.json(attendance);

  } catch (error) {
    console.error("Get Today Attendance Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// GET MY ATTENDANCE HISTORY
// ==========================================
export const getMyAttendance = async (req, res) => {
  try {
    const userId = parseInt(req.query.userId);

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const employee = await prisma.employee.findFirst({
      where: { user_id: userId }
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    const history = await prisma.attendance.findMany({
      where: { employee_id: employee.id },
      orderBy: { date: 'desc' }
    });

    res.json(history);

  } catch (error) {
    console.error("Get Attendance History Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// GET ATTENDANCE STATS
// ==========================================
export const getAttendanceStats = async (req, res) => {
  try {
    const userId = parseInt(req.query.userId);

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const employee = await prisma.employee.findFirst({
      where: { user_id: userId }
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    const logs = await prisma.attendance.findMany({
      where: { employee_id: employee.id }
    });

    const totalDays = logs.length;
    const presentCount = logs.filter(l => l.status === 'Present').length;
    const lateCount = logs.filter(l => l.status === 'Late').length;
    const absentCount = logs.filter(l => l.status === 'Absent').length;
    const halfDayCount = logs.filter(l => l.status === 'Half Day').length;

    const completedLogs = logs.filter(l => l.total_hours !== null);
    const totalHours = completedLogs.reduce((sum, curr) => sum + parseFloat(curr.total_hours), 0);
    const avgHours = completedLogs.length > 0 ? parseFloat((totalHours / completedLogs.length).toFixed(2)) : 0;

    res.json({
      totalDays,
      presentCount,
      lateCount,
      absentCount,
      halfDayCount,
      avgHours
    });

  } catch (error) {
    console.error("Get Attendance Stats Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// GET ALL EMPLOYEES' ATTENDANCE (HR ONLY)
// ==========================================
export const getAllAttendance = async (req, res) => {
  try {
    const filterDateStr = req.query.date;
    const dateStr = filterDateStr || new Date().toLocaleDateString('en-CA');
    const filterDate = new Date(dateStr + 'T00:00:00.000Z');

    const employees = await prisma.employee.findMany({
      include: {
        user: true,
        department: true,
        attendance: {
          where: {
            date: filterDate
          }
        }
      },
      orderBy: {
        first_name: 'asc'
      }
    });

    res.json(employees);

  } catch (error) {
    console.error("Get All Attendance Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ==========================================
// MANUAL ATTENDANCE OVERRIDE (HR ONLY)
// ==========================================
export const manualAttendance = async (req, res) => {
  try {
    const { employeeId, date, clockIn, clockOut, status, remarks } = req.body;

    if (!employeeId || !date || !status) {
      return res.status(400).json({ message: "employeeId, date, and status are required" });
    }

    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(employeeId) }
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee profile not found" });
    }

    const recordDate = new Date(date + 'T00:00:00.000Z');

    const parsedClockIn = clockIn ? new Date(clockIn) : null;
    const parsedClockOut = clockOut ? new Date(clockOut) : null;

    let totalHours = null;
    if (parsedClockIn && parsedClockOut) {
      const diffMs = parsedClockOut - parsedClockIn;
      totalHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
    }

    const record = await prisma.attendance.upsert({
      where: {
        employee_id_date: {
          employee_id: employee.id,
          date: recordDate
        }
      },
      update: {
        clock_in: parsedClockIn,
        clock_out: parsedClockOut,
        status: status,
        total_hours: totalHours,
        remarks: remarks || null
      },
      create: {
        employee_id: employee.id,
        date: recordDate,
        clock_in: parsedClockIn,
        clock_out: parsedClockOut,
        status: status,
        total_hours: totalHours,
        remarks: remarks || null
      }
    });

    res.json({
      message: "Attendance record updated successfully",
      attendance: record
    });

  } catch (error) {
    console.error("Manual Attendance Error:", error);
    res.status(500).json({ error: error.message });
  }
};
