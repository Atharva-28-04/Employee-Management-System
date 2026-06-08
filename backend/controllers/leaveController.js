import prisma from '../config/prismaClient.js';

// ==========================================
// APPLY LEAVE
// ==========================================
export const applyLeave = async (req, res) => {
  try {

    const {
      userId,
      leaveTypeId,
      fromDate,
      toDate,
      totalDays,
      reason
    } = req.body;

    console.log("REQ BODY:", req.body);
    console.log("USER ID:", userId);

    const employee = await prisma.employee.findFirst({
      where: {
        user_id: parseInt(userId)
      }
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee profile not found"
      });
    }

    const leave = await prisma.leaveApplication.create({
      data: {
        employee_id: employee.id,
        leave_type_id: parseInt(leaveTypeId),
        from_date: new Date(fromDate),
        to_date: new Date(toDate),
        total_days: parseInt(totalDays),
        reason: reason,
        status: "Pending"
      }
    });

    res.status(201).json({
      message: "Leave application submitted successfully",
      leave
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }
};

// ==========================================
// GET MY LEAVES
// ==========================================
export const getMyLeaves = async (req, res) => {
  try {

    const userId = parseInt(req.query.userId);

    const employee = await prisma.employee.findFirst({
      where: {
        user_id: userId
      }
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee profile not found"
      });
    }

    const leaves = await prisma.leaveApplication.findMany({
      where: {
        employee_id: employee.id
      },
      include: {
        leaveType: true,
        approvals: true
      },
      orderBy: {
        created_at: "desc"
      }
    });

    res.json(leaves);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

// ==========================================
// GET ALL PENDING LEAVES
// (Manager / HR Dashboard)
// ==========================================
export const getPendingLeaves = async (req, res) => {
  try {

    const leaves = await prisma.leaveApplication.findMany({
      where: {
        status: {
          in: ["Pending", "Manager Approved"]
        }
      },
      include: {
        employee: {
          include: {
            user: true
          }
        },
        leaveType: true,
        approvals: true
      },
      orderBy: {
        created_at: "desc"
      }
    });

    res.json(leaves);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

// ==========================================
// MANAGER APPROVE
// ==========================================
export const managerApproveLeave = async (req, res) => {
  try {

    const leaveId = parseInt(req.params.id);

    const leave = await prisma.leaveApplication.update({
      where: {
        id: leaveId
      },
      data: {
        status: "Manager Approved"
      }
    });

    await prisma.approvalHistory.create({
      data: {
        leave_id: leaveId,
        approved_by: parseInt(req.body.approvedBy),
        action: "Manager Approved",
        remarks: req.body.remarks || null
      }
    });

    res.json({
      message: "Leave approved by manager",
      leave
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

// ==========================================
// MANAGER REJECT
// ==========================================
export const managerRejectLeave = async (req, res) => {
  try {

    const leaveId = parseInt(req.params.id);

    const leave = await prisma.leaveApplication.update({
      where: {
        id: leaveId
      },
      data: {
        status: "Manager Rejected"
      }
    });

    await prisma.approvalHistory.create({
      data: {
        leave_id: leaveId,
        approved_by: parseInt(req.body.approvedBy),
        action: "Manager Rejected",
        remarks: req.body.remarks || null
      }
    });

    res.json({
      message: "Leave rejected by manager",
      leave
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};

// ==========================================
// HR FINAL APPROVAL
// ==========================================
export const hrApproveLeave = async (req, res) => {
  try {

    const leaveId = parseInt(req.params.id);

    const leave = await prisma.leaveApplication.findUnique({
      where: {
        id: leaveId
      }
    });

    if (!leave) {
      return res.status(404).json({
        message: "Leave request not found"
      });
    }

    await prisma.$transaction(async (tx) => {

      await tx.leaveApplication.update({
        where: {
          id: leaveId
        },
        data: {
          status: "Approved"
        }
      });

      await tx.leaveBalance.updateMany({
        where: {
          employee_id: leave.employee_id,
          leave_type_id: leave.leave_type_id
        },
        data: {
          available_days: {
            decrement: leave.total_days
          }
        }
      });

      await tx.approvalHistory.create({
        data: {
          leave_id: leaveId,
          approved_by: parseInt(req.body.approvedBy),
          action: "HR Approved",
          remarks: req.body.remarks || null
        }
      });

    });

    res.json({
      message: "Leave finally approved and balance updated"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: error.message
    });

  }
};

// ==========================================
// HR REJECT
// ==========================================
export const hrRejectLeave = async (req, res) => {
  try {

    const leaveId = parseInt(req.params.id);

    await prisma.leaveApplication.update({
      where: {
        id: leaveId
      },
      data: {
        status: "Rejected"
      }
    });

    await prisma.approvalHistory.create({
      data: {
        leave_id: leaveId,
        approved_by: parseInt(req.body.approvedBy),
        action: "HR Rejected",
        remarks: req.body.remarks || null
      }
    });

    res.json({
      message: "Leave rejected by HR"
    });

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }
};