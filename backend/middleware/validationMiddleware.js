import { employeeSchema } from '../validators/employee.validator.js';
import { leaveSchema } from '../validators/leave.validator.js';
import { assetSchema } from '../validators/asset.validator.js';

export const validateEmployee = (req, res, next) => {
    const { error } = employeeSchema.validate(req.body, { abortEarly: false });

    if (error) {
        console.log('VALIDATION ERROR:', error.details);

        return res.status(422).json({
            success: false,
            message: 'Validation failed',
            errors: error.details.map(e => e.message)
        });
    }

    next();
};

export const validateLeave = (req, res, next) => {
    const { error } = leaveSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(422).json({
            success: false,
            message: 'Validation failed',
            errors: error.details.map(e => e.message)
        });
    }
    next();
};

export const validateAsset = (req, res, next) => {
    const { error } = assetSchema.validate(req.body, { abortEarly: false });
    if (error) {
        return res.status(422).json({
            success: false,
            message: 'Validation failed',
            errors: error.details.map(e => e.message)
        });
    }
    next();
};