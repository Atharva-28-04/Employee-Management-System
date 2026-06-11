import * as employeeService from '../services/employee.service.js';

// ==========================================
// 1. CREATE EMPLOYEE PROFILE
// ==========================================
export const createEmployee = async (req, res, next) => {
    try {
        const newEmployee = await employeeService.createEmployee(req.body, req.file);
        res.status(201).json({ message: "Employee profile created successfully", data: newEmployee });
    } catch (error) {
        // We pass the error to Winston so it prints in the terminal!
        next(error);
    }
};

// ==========================================
// 2. GET ALL EMPLOYEES
// ==========================================
export const getAllEmployees = async (req, res, next) => {
    try {
        // Using req.query so your Pagination and Search works!
        const employees = await employeeService.getAllEmployees(req.query);
        res.json(employees);
    } catch (error) {
        next(error);
    }
};

// ==========================================
// 3. UPDATE EMPLOYEE PROFILE
// ==========================================
export const updateEmployee = async (req, res, next) => {
    try {
        const updatedEmployee = await employeeService.updateEmployee(req.params.id, req.body, req.file);
        res.json({ message: "Employee updated successfully", data: updatedEmployee });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// 4. DELETE EMPLOYEE
// ==========================================
export const deleteEmployee = async (req, res, next) => {
    try {
        await employeeService.deleteEmployee(req.params.id);
        res.json({ message: "Employee records purged successfully" });
    } catch (error) {
        next(error);
    }
};

export const getEmployeeById = async (req, res, next) => {
    try {
        const employee = await employeeService.getEmployeeById(req.params.id);
        if (!employee) {
            return res.status(404).json({ message: "Employee profile not found" });
        }
        res.json(employee);
    } catch (error) {
        next(error);
    }
};