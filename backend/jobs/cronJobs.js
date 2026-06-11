import cron from 'node-cron';
import logger from '../utils/logger.js';
import prisma from '../config/prismaClient.js';

// ✅ Job 1: Daily Leave Report — runs every day at 8:00 AM
cron.schedule('0 8 * * *', async () => {
    logger.info('⏰ Running Daily Leave Report Job...');
    try {
        const pendingLeaves = await prisma.leaveApplication.count({
            where: { status: 'Pending' }
        });
        logger.info(`📊 Daily Report: ${pendingLeaves} pending leave requests`);
    } catch (error) {
        logger.error(`❌ Daily Leave Report Job Failed: ${error.message}`);
    }
});

// ✅ Job 2: Notification Cleanup — runs every day at midnight
cron.schedule('0 0 * * *', async () => {
    logger.info('🧹 Running Notification Cleanup Job...');
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const deleted = await prisma.notification.deleteMany({
            where: {
                created_at: { lt: thirtyDaysAgo }
            }
        });
        logger.info(`🗑️ Cleaned up ${deleted.count} old notifications`);
    } catch (error) {
        logger.error(`❌ Notification Cleanup Job Failed: ${error.message}`);
    }
});

// ✅ Job 3: Daily Backup Log — runs every day at 11:00 PM
cron.schedule('0 23 * * *', async () => {
    logger.info('💾 Running Daily Backup Job...');
    try {
        const employeeCount = await prisma.employee.count();
        const leaveCount = await prisma.leaveApplication.count();
        const assetCount = await prisma.asset.count();
        logger.info(`✅ Backup Log — Employees: ${employeeCount}, Leaves: ${leaveCount}, Assets: ${assetCount}`);
    } catch (error) {
        logger.error(`❌ Daily Backup Job Failed: ${error.message}`);
    }
});

// ✅ Job 4: Daily Attendance Absence Marker — runs every day at 11:59 PM
cron.schedule('59 23 * * *', async () => {
    logger.info('⏰ Running Daily Attendance Absence Marker Job...');
    try {
        const localDateStr = new Date().toLocaleDateString('en-CA');
        const today = new Date(localDateStr + 'T00:00:00.000Z');

        // Find all employees
        const employees = await prisma.employee.findMany();

        let count = 0;
        for (const emp of employees) {
            // Check if they have an attendance record for today
            const record = await prisma.attendance.findUnique({
                where: {
                    employee_id_date: {
                        employee_id: emp.id,
                        date: today
                    }
                }
            });

            if (!record) {
                // Check if they had a leave application that is approved for today
                const leave = await prisma.leaveApplication.findFirst({
                    where: {
                        employee_id: emp.id,
                        status: 'Approved',
                        from_date: { lte: today },
                        to_date: { gte: today }
                    }
                });

                // Create attendance record
                await prisma.attendance.create({
                    data: {
                        employee_id: emp.id,
                        date: today,
                        clock_in: null,
                        clock_out: null,
                        status: leave ? 'On Leave' : 'Absent',
                        total_hours: 0,
                        remarks: leave ? `Approved Leave: ${leave.reason}` : 'System marked absent: No check-in'
                    }
                });
                count++;
            }
        }
        logger.info(`✅ Daily Attendance Job Complete. Marked ${count} employees absent/on-leave.`);
    } catch (error) {
        logger.error(`❌ Daily Attendance Absence Marker Job Failed: ${error.message}`);
    }
});

logger.info('✅ All Cron Jobs Scheduled Successfully');