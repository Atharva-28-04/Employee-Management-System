import Joi from 'joi';

export const employeeSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(10).max(15).required(),
    salary: Joi.number().positive().required(),
    departmentId: Joi.number().integer().optional(),
    address: Joi.string().max(200).optional(),
    designation: Joi.string().max(100).optional(),
});