import 'dotenv/config';
import prisma from './config/prismaClient.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Seeding database with assignment data...');

  // ✅ 1. Departments
  await prisma.department.createMany({
    data: [
      { department_name: 'IT' },
      { department_name: 'HR' },
      { department_name: 'Finance' },
      { department_name: 'Marketing' }
    ],
    skipDuplicates: true
  });
  console.log('✅ Departments seeded');

  // ✅ 2. Skills
  await prisma.skill.createMany({
    data: [
      { skill_name: 'React' },
      { skill_name: 'NodeJS' },
      { skill_name: 'PostgreSQL' },
      { skill_name: 'Python' },
      { skill_name: 'Java' }
    ],
    skipDuplicates: true
  });
  console.log('✅ Skills seeded');

  // ✅ 3. Leave Types
  await prisma.leaveType.createMany({
    data: [
      { leave_name: 'Casual Leave', total_days: 10 },
      { leave_name: 'Sick Leave', total_days: 7 },
      { leave_name: 'Annual Leave', total_days: 15 },
      { leave_name: 'Maternity Leave', total_days: 90 },
    ],
    skipDuplicates: true
  });
  console.log('✅ Leave Types seeded');

  // ✅ 4. Fetch departments & skills for linking
  const itDept = await prisma.department.findFirst({ where: { department_name: 'IT' } });
  const hrDept = await prisma.department.findFirst({ where: { department_name: 'HR' } });
  const financeDept = await prisma.department.findFirst({ where: { department_name: 'Finance' } });
  const marketingDept = await prisma.department.findFirst({ where: { department_name: 'Marketing' } });

  const reactSkill = await prisma.skill.findFirst({ where: { skill_name: 'React' } });
  const nodeSkill = await prisma.skill.findFirst({ where: { skill_name: 'NodeJS' } });
  const pgSkill = await prisma.skill.findFirst({ where: { skill_name: 'PostgreSQL' } });
  const pythonSkill = await prisma.skill.findFirst({ where: { skill_name: 'Python' } });
  const javaSkill = await prisma.skill.findFirst({ where: { skill_name: 'Java' } });

  // ✅ 5. Admin User
  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@hrms.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@hrms.com',
      password: hashedPassword,
      role: 'admin',
    }
  });
  console.log('✅ Admin user seeded');

  // ✅ 6. Employees
  const employeesData = [
    {
      email: 'john.doe@hrms.com',
      name: 'John Doe',
      first_name: 'John',
      last_name: 'Doe',
      department_id: itDept.id,
      designation: 'Frontend Developer',
      phone: '9876543210',
      salary: 55000,
      skills: [reactSkill.id, nodeSkill.id]
    },
    {
      email: 'jane.smith@hrms.com',
      name: 'Jane Smith',
      first_name: 'Jane',
      last_name: 'Smith',
      department_id: hrDept.id,
      designation: 'HR Manager',
      phone: '9876543211',
      salary: 60000,
      skills: [pythonSkill.id]
    },
    {
      email: 'mike.johnson@hrms.com',
      name: 'Mike Johnson',
      first_name: 'Mike',
      last_name: 'Johnson',
      department_id: financeDept.id,
      designation: 'Finance Analyst',
      phone: '9876543212',
      salary: 50000,
      skills: [pgSkill.id, pythonSkill.id]
    },
    {
      email: 'sarah.williams@hrms.com',
      name: 'Sarah Williams',
      first_name: 'Sarah',
      last_name: 'Williams',
      department_id: marketingDept.id,
      designation: 'Marketing Lead',
      phone: '9876543213',
      salary: 52000,
      skills: [reactSkill.id]
    },
    {
      email: 'raj.kumar@hrms.com',
      name: 'Raj Kumar',
      first_name: 'Raj',
      last_name: 'Kumar',
      department_id: itDept.id,
      designation: 'Backend Developer',
      phone: '9876543214',
      salary: 58000,
      skills: [nodeSkill.id, pgSkill.id, javaSkill.id]
    },
  ];

  for (const emp of employeesData) {
    const password = await bcrypt.hash('Employee@123', 10);

    // Create User
    const user = await prisma.user.upsert({
      where: { email: emp.email },
      update: {},
      create: {
        name: emp.name,
        email: emp.email,
        password: password,
        role: 'employee',
      }
    });

    // Create Employee Profile
    const employee = await prisma.employee.upsert({
      where: { user_id: user.id },
      update: {},
      create: {
        user_id: user.id,
        first_name: emp.first_name,
        last_name: emp.last_name,
        department_id: emp.department_id,
        designation: emp.designation,
        phone: emp.phone,
        salary: emp.salary,
      }
    });

    // Link Skills
    for (const skillId of emp.skills) {
      await prisma.employeeSkill.upsert({
        where: {
          id: (await prisma.employeeSkill.findFirst({
            where: { employee_id: employee.id, skill_id: skillId }
          }))?.id ?? 0
        },
        update: {},
        create: {
          employee_id: employee.id,
          skill_id: skillId,
        }
      });
    }
  }
  console.log('✅ Employees seeded');

  console.log('🎉 All seeding complete!');
  console.log('👤 Admin Login: admin@hrms.com / Admin@123');
  console.log('👤 Employee Login: john.doe@hrms.com / Employee@123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });