import express from 'express';
// 🌟 1. We import the modernized Controller!
import * as employeeController from '../controllers/employeeController.js';
import { validateEmployee } from '../middleware/validationMiddleware.js';
import { authorizeRoles } from '../middleware/authMiddleware.js';
import prisma from '../config/prismaClient.js';

const router = express.Router();

// ==========================================
// ENTERPRISE CRUD ROUTES (Wired to Controller)
// ==========================================

// Create Employee (Now triggers your Service & Email!)
router.post('/', authorizeRoles('hr'), validateEmployee, employeeController.createEmployee);

// Get All Employees (Now uses Pagination & Search!)
router.get('/', authorizeRoles('hr'), employeeController.getAllEmployees);

// Get Single Employee
router.get('/:id', authorizeRoles('hr'), employeeController.getEmployeeById);

// Update Employee
router.put('/:id', authorizeRoles('hr'), employeeController.updateEmployee);

// Delete Employee
router.delete('/:id', authorizeRoles('hr'), employeeController.deleteEmployee);


// ==========================================
// SQL JOIN ASSIGNMENTS (Left intact for your homework/requirements)
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