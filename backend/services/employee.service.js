import employeeRepository from '../repositories/employee.repository.js';
import bcrypt from 'bcryptjs';
import { sendWelcomeEmail } from '../utils/email.js';
import prisma from '../config/prismaClient.js';

export const createEmployee = async (employeeData, file) => {
    // 1. Extract fields
    const { firstName, lastName, phone, email, departmentId, address, designation, salary } = employeeData;

    const fullName = `${firstName || ''} ${lastName || ''}`.trim();
    const defaultPassword = "Welcome123!"; 

    if (!firstName || !email) {
        throw new Error("VALIDATION_ERROR: Name and email are required");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    // 2. Map data
    const dataToSave = {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        address: address,
        designation: designation,
        salary: salary ? parseFloat(salary) : null,
        department: departmentId ? { connect: { id: parseInt(departmentId) } } : undefined, 
        user: {
            create: {
                name: fullName,
                email: email,
                password: hashedPassword,
                role: 'employee'
            }
        }
    };

    // 3. Save and Notify
    const newEmployee = await employeeRepository.create(dataToSave);

    // Initialize Leave Balances for all active LeaveTypes
    try {
        const leaveTypes = await prisma.leaveType.findMany();
        for (const lt of leaveTypes) {
            await prisma.leaveBalance.create({
                data: {
                    employee_id: newEmployee.id,
                    leave_type_id: lt.id,
                    available_days: lt.total_days
                }
            });
        }
    } catch (err) {
        console.error("Error initializing leave balances:", err);
    }

    sendWelcomeEmail(email, fullName, defaultPassword);
    return newEmployee;
};

export const getAllEmployees = async (query) => {
    const { search, page = 1, limit = 50 } = query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);
    const whereClause = search ? {
        user: { name: { contains: search, mode: 'insensitive' } }
    } : {};

    return await employeeRepository.findAll(whereClause, skip, take);
};

export const updateEmployee = async (id, updateData, file) => {
    const { firstName, lastName, phone, departmentId } = updateData;

    const dataToUpdate = {
        first_name: firstName,
        last_name: lastName,
        phone,
        department: departmentId ? { connect: { id: parseInt(departmentId) } } : undefined
    };

    if (file) {
        dataToUpdate.profileImage = `/uploads/${file.filename}`;
    }

    return await employeeRepository.update(id, dataToUpdate);
};

export const deleteEmployee = async (id) => {
    return await employeeRepository.remove(id);
};

export const getEmployeeById = async (id) => {
    return await employeeRepository.findById(id);
};