import prisma from '../config/prismaClient.js';

// GET ALL AUDIT LOGS
export const getAuditLogs = async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: {
        created_at: 'desc'
      }
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};