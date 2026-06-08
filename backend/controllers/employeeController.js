const prisma = require('../config/prismaClient');

// ==========================================
// 1. CREATE EMPLOYEE PROFILE (ADMIN ONLY)
// ==========================================
exports.createEmployee = async (req, res) => {
    try {
        const { name, phone, email, password, departmentId } = req.body;

        // Ensure mandatory info is present
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }

        // Auto-create the User Auth account and link the Employee profile together
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newEmployee = await prisma.employee.create({
            data: {
                name,
                phone,
                profileImage: req.file ? `/uploads/${req.file.filename}` : null,
                departmentId: departmentId ? parseInt(departmentId) : null,
                user: {
                    create: {
                        email,
                        password: hashedPassword,
                        role: 'USER'
                    }
                }
            },
            include: { user: true, department: true }
        });

        res.status(201).json({ message: "Employee profile created successfully", data: newEmployee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==========================================
// 2. GET ALL EMPLOYEES (ADMIN / USER)
// ==========================================
exports.getAllEmployees = async (req, res) => {
    try {
        const employees = await prisma.employee.findMany({
            include: {
                user: { select: { email: true, role: true } },
                department: true,
                skills: { include: { skill: true } }
            }
        });
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==========================================
// 3. UPDATE EMPLOYEE PROFILE
// ==========================================
exports.updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, departmentId } = req.body;

        const updatedData = {
            name,
            phone,
            departmentId: departmentId ? parseInt(departmentId) : null
        };

        // If a new image was uploaded via Multer, append its path
        if (req.file) {
            updatedData.profileImage = `/uploads/${req.file.filename}`;
        }

        const updatedEmployee = await prisma.employee.update({
            where: { id: parseInt(id) },
            data: updatedData
        });

        res.json({ message: "Employee updated successfully", data: updatedEmployee });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ==========================================
// 4. DELETE EMPLOYEE (ADMIN ONLY)
// ==========================================
exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        // Cascade delete handles removing the linked user row automatically
        await prisma.employee.delete({
            where: { id: parseInt(id) }
        });

        res.json({ message: "Employee records purged successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};