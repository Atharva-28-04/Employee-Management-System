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

logger.info('✅ All Cron Jobs Scheduled Successfully');