import Joi from 'joi';

export const employeeSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),

    name: Joi.string().optional(),

    email: Joi.string().email().required(),
    phone: Joi.string().min(10).max(15).required(),

    salary: Joi.number().positive().required(),

    departmentId: Joi.number().integer().optional(),

    address: Joi.string().allow('').max(200).optional(),

    designation: Joi.string().max(100).optional(),

    skills: Joi.array().items(Joi.number()).optional()
});