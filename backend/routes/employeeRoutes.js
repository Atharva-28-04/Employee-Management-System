import express from 'express';
// 🌟 1. We import the modernized Controller!
import * as employeeController from '../controllers/employeeController.js';
import { validateEmployee } from '../middleware/validationMiddleware.js';

const router = express.Router();

// ==========================================
// ENTERPRISE CRUD ROUTES (Wired to Controller)
// ==========================================

// Create Employee (Now triggers your Service & Email!)
router.post('/', validateEmployee, employeeController.createEmployee);

// Get All Employees (Now uses Pagination & Search!)
router.get('/', employeeController.getAllEmployees);

// Update Employee
router.put('/:id', employeeController.updateEmployee);

// Delete Employee
router.delete('/:id', employeeController.deleteEmployee);


// ==========================================
// SQL JOIN ASSIGNMENTS (Left intact for your homework/requirements)
// ==========================================
router.get('/join-departments', async (req, res) => {
  try {
    const data = await req.prisma.$queryRawUnsafe(`
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
    const data = await req.prisma.$queryRawUnsafe(`
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