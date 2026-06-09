import express from 'express';
import prisma from '../config/prismaClient.js';
import bcrypt from 'bcryptjs';
import {
  validateEmployee
} from '../middleware/validationMiddleware.js';



const router = express.Router();

// ==========================================
// CREATE Employee with Skill mappings
// POST /api/employees 
// ==========================================
router.post(
  '/',
  validateEmployee,
  async (req, res) => {
  try {
    const { firstName, lastName, email, phone, departmentId, designation, salary, skills, address } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "Email already exists." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Welcome123!", salt);

    const skillConnections = skills ? skills.map(skillId => ({
      skill: { connect: { id: parseInt(skillId) } }
    })) : [];

    const newEmployee = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`.trim(),
        email: email,
        password: hashedPassword,
        role: 'employee',
        employeeProfile: {
          create: {
            phone: phone,
            address: address || null,
            designation: designation,
            salary: salary ? parseFloat(salary) : null,
            department_id: departmentId ? parseInt(departmentId) : null,
            skills: { create: skillConnections }
          }
        }
      },
      include: { employeeProfile: true }
    });

    res.status(201).json({ message: "Employee registered!", employeeId: newEmployee.employeeProfile.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// GET All Employees for Directory list
// GET /api/employees 
// ==========================================
router.get('/', async (req, res) => {
  try {
    const employees = await prisma.employee.findMany({
      include: { 
        user: true, 
        department: true, 
        skills: { include: { skill: true } },
        images: true 
      }
    });
    
    const formattedEmployees = employees.map(emp => ({
      id: emp.id,
      userId: emp.user_id,
      
name: emp.user?.name || 'Unknown',
      phone: emp.phone,
      address: emp.address,
      designation: emp.designation,
      salary: emp.salary,
      user: { email: emp.user?.email || '', role: emp.user?.role || 'user' },
      department: { id: emp.department_id, name: emp.department?.department_name || 'Unassigned' },
      documents: emp.images.map(img => ({ filePath: img.image_url })),
      skills: emp.skills.map(s => s.skill)
    }));
    
    res.json(formattedEmployees);
  } catch (error) {
  console.error("UPDATE ERROR:", error);
  res.status(500).json({ error: error.message });
}
});

// ==========================================
// ADDED FEATURE: GET Single Employee by ID
// GET /api/employees/:id 
// ==========================================
router.get('/:id', async (req, res) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { 
        user: true, 
        department: true, 
        skills: { include: { skill: true } },
        images: true 
      }
    });

    if (!employee) return res.status(404).json({ message: "Employee profile not found." });

    const formattedEmployee = {
      id: employee.id,
      userId: employee.user_id,
 name: emp.user?.name || 'Unknown',
      phone: employee.phone,
      address: employee.address,
      designation: employee.designation,
      salary: employee.salary,
      user: { email: employee.user?.email || '', role: employee.user?.role || 'user' },
      department: { id: employee.department_id, name: employee.department?.department_name || 'Unassigned' },
      documents: employee.images.map(img => ({ id: img.id, filePath: img.image_url })),
      skills: employee.skills.map(s => s.skill)
    };

    res.json(formattedEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// ==========================================
// UPDATE Employee Profile
// PUT /api/employees/:id
// ==========================================
router.put('/:id', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phone,
      departmentId,
      designation,
      salary,
      skills,
      address
    } = req.body;

    const employeeId = parseInt(req.params.id);

    const employee = await prisma.employee.findUnique({
      where: { id: employeeId }
    });

    if (!employee) {
      return res.status(404).json({
        message: "Employee profile not found."
      });
    }

    await prisma.employee.update({
      where: { id: employeeId },
      data: {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        address: address,
        designation: designation,
        salary: salary ? parseFloat(salary) : null,
        department_id: departmentId
          ? parseInt(departmentId)
          : null
      }
    });
await prisma.user.update({
  where: {
    id: employee.user_id
  },
  data: {
    name: `${firstName} ${lastName}`.trim()
  }
});
    if (skills) {
      await prisma.employeeSkill.deleteMany({
        where: {
          employee_id: employeeId
        }
      });

      if (skills.length > 0) {
        await prisma.employeeSkill.createMany({
          data: skills.map(skillId => ({
            employee_id: employeeId,
            skill_id: parseInt(skillId)
          }))
        });
      }
    }

    res.json({
      message: "Employee updated successfully"
    });

  } catch (error) {
    console.error("UPDATE ERROR:", error);

    res.status(500).json({
      error: error.message
    });
  }
});

// ==========================================
// DELETE Employee
// DELETE /api/employees/:userId 
// ==========================================
router.delete('/:userId', async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: parseInt(req.params.userId) } });
    res.json({ message: "Employee deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

// ==========================================
// SQL JOIN ASSIGNMENT 1: Employees & Departments [cite: 5, 49, 50, 51]
// ==========================================
router.get('/join-departments', async (req, res) => {
  try {
    const data = await prisma.$queryRawUnsafe(`
      SELECT u.name, d.department_name
      FROM "Employee" ep
      INNER JOIN "User" u ON ep.user_id = u.id
      INNER JOIN "Department" d ON ep.department_id = d.id;
    `);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// SQL JOIN ASSIGNMENT 2: Employees & Skills [cite: 5, 49, 52, 53]
// ==========================================
router.get('/join-skills', async (req, res) => {
  try {
    const data = await prisma.$queryRawUnsafe(`
      SELECT u.name, s.skill_name
      FROM "EmployeeSkill" es
      INNER JOIN "Employee" ep ON es.employee_id = ep.id
      INNER JOIN "User" u ON ep.user_id = u.id
      INNER JOIN "Skill" s ON es.skill_id = s.id;
    `);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;