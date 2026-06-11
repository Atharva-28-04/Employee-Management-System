import 'dotenv/config';
import prisma from './config/prismaClient.js';

async function seed() {
  console.log('🌱 Seeding historical attendance data...');

  const employees = await prisma.employee.findMany();
  if (employees.length === 0) {
    console.log('❌ No employees found. Please run seed.js first.');
    return;
  }

  // Clear existing attendance first to avoid duplicates
  await prisma.attendance.deleteMany({});
  console.log('🧹 Cleaned up existing attendance records');

  const statuses = ['Present', 'Present', 'Present', 'Late', 'Half Day', 'Absent', 'On Leave'];
  
  // Seed past 14 days
  for (let i = 14; i >= 0; i--) {
    const localDate = new Date();
    localDate.setDate(localDate.getDate() - i);
    const localDateStr = localDate.toLocaleDateString('en-CA');
    const date = new Date(localDateStr + 'T00:00:00.000Z');

    // Skip weekends for realistic simulation
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    for (const emp of employees) {
      // Pick a semi-random status based on employee ID and date index
      const statusIdx = (emp.id + i) % statuses.length;
      const status = statuses[statusIdx];

      let clock_in = null;
      let clock_out = null;
      let total_hours = null;
      let remarks = null;

      if (status === 'Present') {
        clock_in = new Date(date);
        clock_in.setHours(8, 45 + (emp.id % 15), 0); // 8:45 AM - 9:00 AM
        clock_out = new Date(date);
        clock_out.setHours(17, 30 + (emp.id % 20), 0); // 5:30 PM - 5:50 PM
        
        const diff = clock_out - clock_in;
        total_hours = parseFloat((diff / (1000 * 60 * 60)).toFixed(2));
      } else if (status === 'Late') {
        clock_in = new Date(date);
        clock_in.setHours(9, 20 + (emp.id % 20), 0); // 9:20 AM - 9:40 AM (Late)
        clock_out = new Date(date);
        clock_out.setHours(18, 0, 0);
        
        const diff = clock_out - clock_in;
        total_hours = parseFloat((diff / (1000 * 60 * 60)).toFixed(2));
        remarks = 'Arrived late due to traffic';
      } else if (status === 'Half Day') {
        clock_in = new Date(date);
        clock_in.setHours(9, 0, 0);
        clock_out = new Date(date);
        clock_out.setHours(12, 30, 0); // 3.5 hours
        
        const diff = clock_out - clock_in;
        total_hours = parseFloat((diff / (1000 * 60 * 60)).toFixed(2));
        remarks = 'Personal emergency in afternoon';
      } else if (status === 'Absent') {
        remarks = 'No show / Unplanned absence';
        total_hours = 0;
      } else if (status === 'On Leave') {
        remarks = 'Approved vacation leave';
        total_hours = 0;
      }

      await prisma.attendance.create({
        data: {
          employee_id: emp.id,
          date,
          clock_in,
          clock_out,
          status,
          total_hours,
          remarks
        }
      });
    }
  }

  console.log('✅ Seeding of historical attendance data complete!');
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
