import express from 'express';
import prisma from '../config/prismaClient.js';

const router = express.Router();

// ==========================================
// DEPARTMENT MASTER ENDPOINTS [cite: 29]
// ==========================================

// GET /api/departments - Fetch all departments [cite: 30]
router.get('/departments', async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/departments - Add a new department [cite: 30]
router.post('/departments', async (req, res) => {
  try {
    const { department_name } = req.body;
    if (!department_name) {
      return res.status(400).json({ message: "Department name is required." });
    }

    const newDept = await prisma.department.create({
      data: { department_name: department_name.trim() }
    });

    res.status(201).json({ message: "Department added successfully!", data: newDept });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// SKILLS MASTER ENDPOINTS [cite: 31]
// ==========================================

// GET /api/skills - Fetch all technical skills [cite: 32]
router.get('/skills', async (req, res) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { id: 'asc' }
    });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/skills - Add a new skill [cite: 32]
router.post('/skills', async (req, res) => {
  try {
    const { skill_name } = req.body;
    if (!skill_name) {
      return res.status(400).json({ message: "Skill name is required." });
    }

    const newSkill = await prisma.skill.create({
      data: { skill_name: skill_name.trim() }
    });

    res.status(201).json({ message: "Skill added successfully!", data: newSkill });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;