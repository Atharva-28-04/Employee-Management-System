import 'dotenv/config';
import prisma from './config/prismaClient.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Starting database seed script...');

  // 🧹 Clean up existing tables in safe dependency order
  console.log('🧹 Cleaning up database tables...');
  await prisma.auditLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.assetHistory.deleteMany({});
  await prisma.assetAllocation.deleteMany({});
  await prisma.asset.deleteMany({});
  await prisma.approvalHistory.deleteMany({});
  await prisma.leaveApplication.deleteMany({});
  await prisma.leaveBalance.deleteMany({});
  await prisma.employeeSkill.deleteMany({});
  await prisma.skill.deleteMany({});
  await prisma.employeeDocument.deleteMany({});
  await prisma.employee.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.leaveType.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('🧹 Database cleaned.');

  // ==========================================
  // 1. SEED DEPARTMENTS
  // ==========================================
  console.log('🌱 Seeding departments...');
  const departments = await Promise.all([
    prisma.department.create({ data: { department_name: 'IT & Engineering' } }),
    prisma.department.create({ data: { department_name: 'Human Resources' } }),
    prisma.department.create({ data: { department_name: 'Finance' } }),
    prisma.department.create({ data: { department_name: 'Marketing & Sales' } }),
    prisma.department.create({ data: { department_name: 'Operations' } }),
    prisma.department.create({ data: { department_name: 'Customer Support' } }),
  ]);
  console.log(`✅ Seeded ${departments.length} departments.`);

  const itDept = departments[0];
  const hrDept = departments[1];
  const financeDept = departments[2];
  const marketingDept = departments[3];
  const opsDept = departments[4];
  const supportDept = departments[5];

  // ==========================================
  // 2. SEED SKILLS
  // ==========================================
  console.log('🌱 Seeding skills...');
  const skills = await Promise.all([
    prisma.skill.create({ data: { skill_name: 'React.js' } }),
    prisma.skill.create({ data: { skill_name: 'Node.js' } }),
    prisma.skill.create({ data: { skill_name: 'PostgreSQL' } }),
    prisma.skill.create({ data: { skill_name: 'Python' } }),
    prisma.skill.create({ data: { skill_name: 'Docker' } }),
    prisma.skill.create({ data: { skill_name: 'AWS Cloud' } }),
    prisma.skill.create({ data: { skill_name: 'UI/UX Design' } }),
    prisma.skill.create({ data: { skill_name: 'Strategic Finance' } }),
    prisma.skill.create({ data: { skill_name: 'Customer Success' } }),
    prisma.skill.create({ data: { skill_name: 'SEO & Content' } }),
  ]);
  console.log(`✅ Seeded ${skills.length} skills.`);

  const reactSkill = skills[0];
  const nodeSkill = skills[1];
  const pgSkill = skills[2];
  const pythonSkill = skills[3];
  const dockerSkill = skills[4];
  const awsSkill = skills[5];
  const uiuxSkill = skills[6];
  const financeSkill = skills[7];
  const csSkill = skills[8];
  const seoSkill = skills[9];

  // ==========================================
  // 3. SEED LEAVE TYPES
  // ==========================================
  console.log('🌱 Seeding leave types...');
  const leaveTypes = await Promise.all([
    prisma.leaveType.create({ data: { leave_name: 'Casual Leave', total_days: 10 } }),
    prisma.leaveType.create({ data: { leave_name: 'Sick Leave', total_days: 7 } }),
    prisma.leaveType.create({ data: { leave_name: 'Annual Leave', total_days: 15 } }),
    prisma.leaveType.create({ data: { leave_name: 'Maternity Leave', total_days: 90 } }),
  ]);
  console.log(`✅ Seeded ${leaveTypes.length} leave types.`);

  const casualLeave = leaveTypes[0];
  const sickLeave = leaveTypes[1];
  const annualLeave = leaveTypes[2];
  const maternityLeave = leaveTypes[3];

  // ==========================================
  // 4. SEED USERS & EMPLOYEE PROFILES
  // ==========================================
  console.log('🌱 Seeding users and employee profiles...');
  const hrPassword = await bcrypt.hash('HR@123', 10);
  const employeePassword = await bcrypt.hash('Employee@123', 10);
  const customPassword = await bcrypt.hash('123456', 10);

  // A. HR Manager
  const hrUser = await prisma.user.create({
    data: {
      name: 'HR Manager',
      email: 'hr@hrms.com',
      password: hrPassword,
      role: 'hr',
    }
  });

  // Create HR Employee profile
  const hrEmployee = await prisma.employee.create({
    data: {
      user_id: hrUser.id,
      first_name: 'HR',
      last_name: 'Manager',
      department_id: hrDept.id,
      designation: 'Head of Human Resources',
      phone: '9988776655',
      address: 'Corporate Headquarters, Tower A',
      salary: 85000.00,
    }
  });

  // Seeding additional HR accounts from previous sessions
  const hrUser2 = await prisma.user.create({
    data: {
      name: 'HR Admin 2',
      email: 'admin2@gmail.com',
      password: customPassword,
      role: 'hr',
    }
  });
  const hrEmployee2 = await prisma.employee.create({
    data: {
      user_id: hrUser2.id,
      first_name: 'HR',
      last_name: 'Admin 2',
      department_id: hrDept.id,
      designation: 'HR Recruiter',
      phone: '9988776656',
      address: 'Corporate Headquarters',
      salary: 60000.00,
    }
  });

  const hrUser3 = await prisma.user.create({
    data: {
      name: 'Jane HR',
      email: 'jane.hr@hrms.com',
      password: hrPassword,
      role: 'hr',
    }
  });
  const hrEmployee3 = await prisma.employee.create({
    data: {
      user_id: hrUser3.id,
      first_name: 'Jane',
      last_name: 'HR',
      department_id: hrDept.id,
      designation: 'HR Coordinator',
      phone: '9988776657',
      address: 'Corporate Headquarters',
      salary: 55000.00,
    }
  });

  const hrUser4 = await prisma.user.create({
    data: {
      name: 'HR Admin 4',
      email: 'admin4@gmail.com',
      password: hrPassword,
      role: 'hr',
    }
  });
  const hrEmployee4 = await prisma.employee.create({
    data: {
      user_id: hrUser4.id,
      first_name: 'HR',
      last_name: 'Admin 4',
      department_id: hrDept.id,
      designation: 'HR Associate',
      phone: '9988776658',
      address: 'Corporate Headquarters',
      salary: 50000.00,
    }
  });

  // B. Standard Employees
  const employeeData = [
    {
      email: 'aarnavyas495@gmail.com',
      name: 'Aarnav Yas',
      first_name: 'Aarnav',
      last_name: 'Yas',
      department_id: itDept.id,
      designation: 'Junior Developer',
      phone: '9876543210',
      address: 'Vasant Vihar, New Delhi',
      salary: 45000.00,
      skills: [reactSkill.id, nodeSkill.id]
    },
    {
      email: 'john.doe@hrms.com',
      name: 'John Doe',
      first_name: 'John',
      last_name: 'Doe',
      department_id: itDept.id,
      designation: 'Senior Frontend Developer',
      phone: '9812345678',
      address: 'A-45 South Extension, New Delhi',
      salary: 75000.00,
      skills: [reactSkill.id, nodeSkill.id, dockerSkill.id]
    },
    {
      email: 'jane.smith@hrms.com',
      name: 'Jane Smith',
      first_name: 'Jane',
      last_name: 'Smith',
      department_id: hrDept.id,
      designation: 'HR Recruiter',
      phone: '9822334455',
      address: 'Sector 62, Noida',
      salary: 50000.00,
      skills: [pythonSkill.id]
    },
    {
      email: 'mike.johnson@hrms.com',
      name: 'Mike Johnson',
      first_name: 'Mike',
      last_name: 'Johnson',
      department_id: financeDept.id,
      designation: 'Lead Financial Analyst',
      phone: '9833445566',
      address: 'DLF Phase 3, Gurugram',
      salary: 90000.00,
      skills: [pgSkill.id, pythonSkill.id, financeSkill.id]
    },
    {
      email: 'sarah.williams@hrms.com',
      name: 'Sarah Williams',
      first_name: 'Sarah',
      last_name: 'Williams',
      department_id: marketingDept.id,
      designation: 'Digital Marketing Strategist',
      phone: '9844556677',
      address: 'Malviya Nagar, Jaipur',
      salary: 62000.00,
      skills: [reactSkill.id, seoSkill.id]
    },
    {
      email: 'raj.kumar@hrms.com',
      name: 'Raj Kumar',
      first_name: 'Raj',
      last_name: 'Kumar',
      department_id: itDept.id,
      designation: 'DevOps Engineer',
      phone: '9855667788',
      address: 'HSR Layout, Bengaluru',
      salary: 80000.00,
      skills: [dockerSkill.id, awsSkill.id, pgSkill.id]
    },
    {
      email: 'priya.sharma@hrms.com',
      name: 'Priya Sharma',
      first_name: 'Priya',
      last_name: 'Sharma',
      department_id: opsDept.id,
      designation: 'Operations Specialist',
      phone: '9811223344',
      address: 'Ghatkopar East, Mumbai',
      salary: 58000.00,
      skills: [csSkill.id]
    },
    {
      email: 'amit.patel@hrms.com',
      name: 'Amit Patel',
      first_name: 'Amit',
      last_name: 'Patel',
      department_id: supportDept.id,
      designation: 'Customer Success Lead',
      phone: '9877889900',
      address: 'Satellite Road, Ahmedabad',
      salary: 48000.00,
      skills: [csSkill.id]
    },
    {
      email: 'vikram.singh@hrms.com',
      name: 'Vikram Singh',
      first_name: 'Vikram',
      last_name: 'Singh',
      department_id: marketingDept.id,
      designation: 'Sales Executive',
      phone: '9922114433',
      address: 'Bani Park, Jaipur',
      salary: 55000.00,
      skills: [seoSkill.id]
    },
    {
      email: 'ananya.sen@hrms.com',
      name: 'Ananya Sen',
      first_name: 'Ananya',
      last_name: 'Sen',
      department_id: itDept.id,
      designation: 'Lead UI/UX Designer',
      phone: '9966554433',
      address: 'Salt Lake Sector 5, Kolkata',
      salary: 70000.00,
      skills: [uiuxSkill.id, reactSkill.id]
    },
    {
      email: 'samaratthakur2005@gmail.com',
      name: 'Samarat Thakur',
      first_name: 'Samarat',
      last_name: 'Thakur',
      department_id: itDept.id,
      designation: 'Software Developer',
      phone: '9988998899',
      address: 'Tech City, India',
      salary: 60000.00,
      skills: [nodeSkill.id, pgSkill.id]
    }
  ];

  const employees = [];
  employees.push(hrEmployee); // HR Employee is Index 0
  employees.push(hrEmployee2);
  employees.push(hrEmployee3);
  employees.push(hrEmployee4);

  for (const emp of employeeData) {
    const user = await prisma.user.create({
      data: {
        name: emp.name,
        email: emp.email,
        password: employeePassword,
        role: 'employee',
      }
    });

    const employee = await prisma.employee.create({
      data: {
        user_id: user.id,
        first_name: emp.first_name,
        last_name: emp.last_name,
        department_id: emp.department_id,
        designation: emp.designation,
        phone: emp.phone,
        address: emp.address,
        salary: emp.salary,
      }
    });

    // Link Skills
    for (const skillId of emp.skills) {
      await prisma.employeeSkill.create({
        data: {
          employee_id: employee.id,
          skill_id: skillId
        }
      });
    }

    employees.push(employee);
  }
  console.log(`✅ Seeded ${employees.length} employee profiles.`);

  // ==========================================
  // 5. SEED LEAVE BALANCES
  // ==========================================
  console.log('🌱 Seeding leave balances...');
  for (const emp of employees) {
    for (const lt of leaveTypes) {
      await prisma.leaveBalance.create({
        data: {
          employee_id: emp.id,
          leave_type_id: lt.id,
          available_days: lt.total_days
        }
      });
    }
  }
  console.log('✅ Seeded leave balances.');

  // ==========================================
  // 6. SEED LEAVE APPLICATIONS & HISTORIES
  // ==========================================
  console.log('🌱 Seeding leave applications & history...');

  // Helper function to approve and decrement balance
  const createApprovedLeave = async (empId, typeId, from, to, days, reason, remarks) => {
    const leave = await prisma.leaveApplication.create({
      data: {
        employee_id: empId,
        leave_type_id: typeId,
        from_date: new Date(from),
        to_date: new Date(to),
        total_days: days,
        reason,
        status: 'Approved'
      }
    });

    await prisma.leaveBalance.update({
      where: { employee_id_leave_type_id: { employee_id: empId, leave_type_id: typeId } },
      data: { available_days: { decrement: days } }
    });

    await prisma.approvalHistory.create({
      data: {
        leave_id: leave.id,
        approved_by: hrUser.id,
        action: 'HR Approved',
        remarks
      }
    });
  };

  const createRejectedLeave = async (empId, typeId, from, to, days, reason, remarks) => {
    const leave = await prisma.leaveApplication.create({
      data: {
        employee_id: empId,
        leave_type_id: typeId,
        from_date: new Date(from),
        to_date: new Date(to),
        total_days: days,
        reason,
        status: 'Rejected'
      }
    });

    await prisma.approvalHistory.create({
      data: {
        leave_id: leave.id,
        approved_by: hrUser.id,
        action: 'HR Rejected',
        remarks
      }
    });
  };

  const createPendingLeave = async (empId, typeId, from, to, days, reason) => {
    await prisma.leaveApplication.create({
      data: {
        employee_id: empId,
        leave_type_id: typeId,
        from_date: new Date(from),
        to_date: new Date(to),
        total_days: days,
        reason,
        status: 'Pending'
      }
    });
  };

  const createManagerApprovedLeave = async (empId, typeId, from, to, days, reason, remarks) => {
    const leave = await prisma.leaveApplication.create({
      data: {
        employee_id: empId,
        leave_type_id: typeId,
        from_date: new Date(from),
        to_date: new Date(to),
        total_days: days,
        reason,
        status: 'Manager Approved'
      }
    });

    await prisma.approvalHistory.create({
      data: {
        leave_id: leave.id,
        approved_by: hrUser.id, // Re-use HR manager ID as placeholder
        action: 'Manager Approved',
        remarks
      }
    });
  };

  // Seed data
  // Index of employees:
  // 0: HR Manager, 1: Aarnav, 2: John, 3: Jane, 4: Mike, 5: Sarah, 6: Raj, 7: Priya, 8: Amit, 9: Vikram, 10: Ananya
  await createApprovedLeave(employees[2].id, casualLeave.id, '2026-05-10T00:00:00.000Z', '2026-05-12T00:00:00.000Z', 3, 'Hometown family gathering', 'Approved, enjoy.');
  await createApprovedLeave(employees[3].id, sickLeave.id, '2026-06-02T00:00:00.000Z', '2026-06-03T00:00:00.000Z', 2, 'Stomach infection', 'Granted rest leaves.');
  await createApprovedLeave(employees[5].id, annualLeave.id, '2026-05-20T00:00:00.000Z', '2026-05-24T00:00:00.000Z', 5, 'Family summer trip', 'Approved. Ensure backup coverage.');
  await createApprovedLeave(employees[6].id, sickLeave.id, '2026-06-08T00:00:00.000Z', '2026-06-08T00:00:00.000Z', 1, 'Dental extraction appointment', 'Approved.');

  await createPendingLeave(employees[1].id, sickLeave.id, '2026-06-16T00:00:00.000Z', '2026-06-17T00:00:00.000Z', 2, 'Severe seasonal flu');
  await createPendingLeave(employees[9].id, casualLeave.id, '2026-06-22T00:00:00.000Z', '2026-06-25T00:00:00.000Z', 4, 'Moving to a new apartment');
  await createPendingLeave(employees[10].id, annualLeave.id, '2026-07-10T00:00:00.000Z', '2026-07-12T00:00:00.000Z', 3, 'Self-rejuvenation trip');
  await createPendingLeave(employees[7].id, casualLeave.id, '2026-06-18T00:00:00.000Z', '2026-06-19T00:00:00.000Z', 2, 'Sister graduation ceremony');

  await createRejectedLeave(employees[4].id, casualLeave.id, '2026-06-01T00:00:00.000Z', '2026-06-02T00:00:00.000Z', 2, 'Long weekend vacation', 'Rejected due to quarterly audit closing schedules.');
  await createRejectedLeave(employees[8].id, annualLeave.id, '2026-06-10T00:00:00.000Z', '2026-06-10T00:00:00.000Z', 1, 'Buying a car', 'Rejected due to system migrations.');

  await createManagerApprovedLeave(employees[2].id, annualLeave.id, '2026-07-01T00:00:00.000Z', '2026-07-03T00:00:00.000Z', 3, 'Friend wedding', 'Manager recommended. Forwarded to HR.');
  await createManagerApprovedLeave(employees[3].id, casualLeave.id, '2026-06-19T00:00:00.000Z', '2026-06-19T00:00:00.000Z', 1, 'Personal work', 'Approved by reporting manager.');

  console.log('✅ Seeded 12 leave applications and histories.');

  // ==========================================
  // 7. SEED ASSETS, ALLOCATIONS & HISTORIES
  // ==========================================
  console.log('🌱 Seeding assets and allocations...');
  const assets = await Promise.all([
    prisma.asset.create({ data: { asset_code: 'LAP-IT-001', asset_name: 'MacBook Pro M3 Max 16"', asset_type: 'Laptop', purchase_date: new Date('2026-01-15T00:00:00.000Z'), purchase_cost: 249000.00, status: 'Allocated' } }),
    prisma.asset.create({ data: { asset_code: 'LAP-IT-002', asset_name: 'Lenovo ThinkPad T14 Gen 4', asset_type: 'Laptop', purchase_date: new Date('2026-02-10T00:00:00.000Z'), purchase_cost: 95000.00, status: 'Allocated' } }),
    prisma.asset.create({ data: { asset_code: 'LAP-IT-003', asset_name: 'MacBook Air M2 13"', asset_type: 'Laptop', purchase_date: new Date('2026-03-01T00:00:00.000Z'), purchase_cost: 115000.00, status: 'Allocated' } }),
    prisma.asset.create({ data: { asset_code: 'LAP-IT-004', asset_name: 'Dell Latitude 5440 Core i7', asset_type: 'Laptop', purchase_date: new Date('2026-04-12T00:00:00.000Z'), purchase_cost: 88000.00, status: 'Allocated' } }),
    prisma.asset.create({ data: { asset_code: 'MON-IT-001', asset_name: 'Dell UltraSharp 27" 4K Monitor', asset_type: 'Display', purchase_date: new Date('2026-03-20T00:00:00.000Z'), purchase_cost: 38000.00, status: 'Available' } }),
    prisma.asset.create({ data: { asset_code: 'MON-IT-002', asset_name: 'LG Ultrawide 34" Monitor', asset_type: 'Display', purchase_date: new Date('2026-04-20T00:00:00.000Z'), purchase_cost: 45000.00, status: 'Allocated' } }),
    prisma.asset.create({ data: { asset_code: 'KEY-IT-001', asset_name: 'Keychron K2 Mechanical Keyboard', asset_type: 'Keyboard', purchase_date: new Date('2026-04-05T00:00:00.000Z'), purchase_cost: 8500.00, status: 'Available' } }),
    prisma.asset.create({ data: { asset_code: 'KEY-IT-002', asset_name: 'Logitech MX Keys Keyboard', asset_type: 'Keyboard', purchase_date: new Date('2026-04-10T00:00:00.000Z'), purchase_cost: 9500.00, status: 'Allocated' } }),
    prisma.asset.create({ data: { asset_code: 'MOB-SL-001', asset_name: 'Samsung S23 Enterprise Device', asset_type: 'Mobile', purchase_date: new Date('2026-01-20T00:00:00.000Z'), purchase_cost: 72000.00, status: 'Allocated' } }),
    prisma.asset.create({ data: { asset_code: 'MOB-SL-002', asset_name: 'iPhone 14 Enterprise Device', asset_type: 'Mobile', purchase_date: new Date('2026-02-28T00:00:00.000Z'), purchase_cost: 78000.00, status: 'Available' } }),
    prisma.asset.create({ data: { asset_code: 'FUR-OP-001', asset_name: 'Herman Miller Aeron Ergonomic Chair', asset_type: 'Furniture', purchase_date: new Date('2026-05-01T00:00:00.000Z'), purchase_cost: 140000.00, status: 'Available' } }),
    prisma.asset.create({ data: { asset_code: 'FUR-OP-002', asset_name: 'ErgoSmart Electric standing desk', asset_type: 'Furniture', purchase_date: new Date('2026-05-05T00:00:00.000Z'), purchase_cost: 29000.00, status: 'Available' } }),
  ]);

  // Asset allocations helper
  const allocate = async (assetIndex, empId, dateStr) => {
    await prisma.assetAllocation.create({
      data: {
        asset_id: assets[assetIndex].id,
        employee_id: empId,
        allocated_by: hrUser.id,
        allocated_date: new Date(dateStr),
        status: 'Allocated'
      }
    });

    await prisma.assetHistory.create({
      data: {
        asset_id: assets[assetIndex].id,
        action: 'Allocation',
        remarks: `Allocated by HR to employee.`,
        created_by: hrUser.id
      }
    });
  };

  // Pre-fill historical purchases
  for (const asst of assets) {
    await prisma.assetHistory.create({
      data: {
        asset_id: asst.id,
        action: 'Purchase',
        remarks: 'Asset bought and checked in stock.',
        created_by: hrUser.id
      }
    });
  }

  // Set active allocations
  await allocate(0, employees[2].id, '2026-02-01T00:00:00.000Z'); // LAP-IT-001 -> John Doe
  await allocate(1, employees[1].id, '2026-06-01T00:00:00.000Z'); // LAP-IT-002 -> Aarnav Yas
  await allocate(2, employees[10].id, '2026-06-01T00:00:00.000Z'); // LAP-IT-003 -> Ananya Sen
  await allocate(3, employees[6].id, '2026-06-05T00:00:00.000Z'); // LAP-IT-004 -> Raj Kumar
  await allocate(5, employees[2].id, '2026-02-05T00:00:00.000Z'); // MON-IT-002 -> John Doe
  await allocate(7, employees[10].id, '2026-06-05T00:00:00.000Z'); // KEY-IT-002 -> Ananya Sen
  await allocate(8, employees[9].id, '2026-06-05T00:00:00.000Z'); // MOB-SL-001 -> Vikram Singh

  console.log(`✅ Seeded ${assets.length} assets and allocations.`);

  // ==========================================
  // 8. SEED HISTORICAL ATTENDANCE (PAST 20 DAYS)
  // ==========================================
  console.log('🌱 Seeding historical attendance...');
  const attendanceStatuses = ['Present', 'Present', 'Present', 'Late', 'Present', 'Present', 'Half Day', 'Present', 'Present'];

  // Seed past 20 days
  for (let i = 20; i >= 0; i--) {
    const localDate = new Date();
    localDate.setDate(localDate.getDate() - i);
    const localDateStr = localDate.toLocaleDateString('en-CA');
    const date = new Date(localDateStr + 'T00:00:00.000Z');

    // Skip weekends for realistic simulation
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    for (const emp of employees) {
      // Pick a status deterministically
      const statusIdx = (emp.id + i) % attendanceStatuses.length;
      const status = attendanceStatuses[statusIdx];

      let clock_in = null;
      let clock_out = null;
      let total_hours = null;
      let remarks = null;

      if (status === 'Present') {
        clock_in = new Date(date);
        clock_in.setHours(9, 0 - (emp.id % 15), 0); // 8:45 AM - 9:00 AM
        clock_out = new Date(date);
        clock_out.setHours(17, 30 + (emp.id % 20), 0); // 5:30 PM - 5:50 PM
        
        const diff = clock_out - clock_in;
        total_hours = parseFloat((diff / (1000 * 60 * 60)).toFixed(2));
      } else if (status === 'Late') {
        clock_in = new Date(date);
        clock_in.setHours(9, 20 + (emp.id % 15), 0); // 9:20 AM - 9:35 AM (Late)
        clock_out = new Date(date);
        clock_out.setHours(18, 0, 0);
        
        const diff = clock_out - clock_in;
        total_hours = parseFloat((diff / (1000 * 60 * 60)).toFixed(2));
        remarks = 'Delayed in heavy morning traffic';
      } else if (status === 'Half Day') {
        clock_in = new Date(date);
        clock_in.setHours(9, 0, 0);
        clock_out = new Date(date);
        clock_out.setHours(13, 0, 0); // 4 hours
        
        const diff = clock_out - clock_in;
        total_hours = parseFloat((diff / (1000 * 60 * 60)).toFixed(2));
        remarks = 'Half-day approved for personal work';
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
  console.log('✅ Seeded 20-day attendance logs.');

  // ==========================================
  // 9. SEED NOTIFICATIONS
  // ==========================================
  console.log('🌱 Seeding notifications...');
  const users = await prisma.user.findMany({ where: { role: 'employee' } });
  for (const usr of users) {
    await prisma.notification.createMany({
      data: [
        {
          user_id: usr.id,
          title: 'Welcome to EMS Portal',
          message: `Dear ${usr.name}, your account is officially set up. Explore your personal dashboard, request leaves, and log daily attendance shifts.`,
          is_read: false
        },
        {
          user_id: usr.id,
          title: 'Corporate Security Advisory',
          message: 'All physical IT devices issued to you must be locked when away from desk.',
          is_read: true
        },
        {
          user_id: usr.id,
          title: 'Leave Policy Update',
          message: 'Annual leave accruals are locked on the 1st of every month. Check leave balances under Apply Leave page.',
          is_read: false
        }
      ]
    });
  }
  console.log('✅ Seeded user notifications.');

  // ==========================================
  // 10. SEED AUDIT LOGS
  // ==========================================
  console.log('🌱 Seeding audit logs...');
  await prisma.auditLog.createMany({
    data: [
      { table_name: 'User', action_type: 'INSERT', record_id: hrUser.id, new_data: { email: hrUser.email, role: hrUser.role }, performed_by: hrUser.id },
      { table_name: 'Department', action_type: 'INSERT', record_id: itDept.id, new_data: { department_name: itDept.department_name }, performed_by: hrUser.id },
      { table_name: 'Department', action_type: 'INSERT', record_id: hrDept.id, new_data: { department_name: hrDept.department_name }, performed_by: hrUser.id },
      { table_name: 'Department', action_type: 'INSERT', record_id: financeDept.id, new_data: { department_name: financeDept.department_name }, performed_by: hrUser.id },
      { table_name: 'Department', action_type: 'INSERT', record_id: marketingDept.id, new_data: { department_name: marketingDept.department_name }, performed_by: hrUser.id },
      { table_name: 'Department', action_type: 'INSERT', record_id: opsDept.id, new_data: { department_name: opsDept.department_name }, performed_by: hrUser.id },
      { table_name: 'Department', action_type: 'INSERT', record_id: supportDept.id, new_data: { department_name: supportDept.department_name }, performed_by: hrUser.id },
      { table_name: 'Skill', action_type: 'INSERT', record_id: reactSkill.id, new_data: { skill_name: reactSkill.skill_name }, performed_by: hrUser.id },
      { table_name: 'Skill', action_type: 'INSERT', record_id: nodeSkill.id, new_data: { skill_name: nodeSkill.skill_name }, performed_by: hrUser.id },
      { table_name: 'Skill', action_type: 'INSERT', record_id: pgSkill.id, new_data: { skill_name: pgSkill.skill_name }, performed_by: hrUser.id },
      { table_name: 'Employee', action_type: 'INSERT', record_id: employees[1].id, new_data: { email: employees[1].phone, name: 'Aarnav Yas' }, performed_by: hrUser.id },
      { table_name: 'Employee', action_type: 'INSERT', record_id: employees[2].id, new_data: { email: employees[2].phone, name: 'John Doe' }, performed_by: hrUser.id },
      { table_name: 'Employee', action_type: 'INSERT', record_id: employees[3].id, new_data: { email: employees[3].phone, name: 'Jane Smith' }, performed_by: hrUser.id },
      { table_name: 'Employee', action_type: 'INSERT', record_id: employees[4].id, new_data: { email: employees[4].phone, name: 'Mike Johnson' }, performed_by: hrUser.id },
      { table_name: 'Asset', action_type: 'INSERT', record_id: assets[0].id, new_data: { asset_code: assets[0].asset_code, asset_name: assets[0].asset_name }, performed_by: hrUser.id },
      { table_name: 'Asset', action_type: 'INSERT', record_id: assets[1].id, new_data: { asset_code: assets[1].asset_code, asset_name: assets[1].asset_name }, performed_by: hrUser.id },
      { table_name: 'Asset', action_type: 'INSERT', record_id: assets[2].id, new_data: { asset_code: assets[2].asset_code, asset_name: assets[2].asset_name }, performed_by: hrUser.id },
      { table_name: 'AssetAllocation', action_type: 'ALLOCATE', record_id: assets[0].id, new_data: { employee_id: employees[2].id, status: 'Allocated' }, performed_by: hrUser.id },
      { table_name: 'AssetAllocation', action_type: 'ALLOCATE', record_id: assets[1].id, new_data: { employee_id: employees[1].id, status: 'Allocated' }, performed_by: hrUser.id },
      { table_name: 'LeaveApplication', action_type: 'APPLY', record_id: 1, new_data: { employee_id: employees[2].id, leave_type_id: casualLeave.id, total_days: 3 }, performed_by: employees[2].id },
      { table_name: 'LeaveApplication', action_type: 'APPROVE', record_id: 1, new_data: { status: 'Approved' }, performed_by: hrUser.id }
    ]
  });
  console.log('✅ Seeded system audit logs.');

  console.log('\n🎉 DB Seeding Complete!');
  console.log('==================================================');
  console.log('👤 HR Manager Accounts:');
  console.log('   - hr@hrms.com (Password: HR@123)');
  console.log('   - admin2@gmail.com (Password: 123456)');
  console.log('   - jane.hr@hrms.com (Password: HR@123)');
  console.log('   - admin4@gmail.com (Password: HR@123)');
  console.log('👤 Employee Accounts (Password: Employee@123):');
  console.log('   - aarnavyas495@gmail.com');
  console.log('   - samaratthakur2005@gmail.com');
  console.log('   - john.doe@hrms.com');
  console.log('==================================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });