import Joi from 'joi';

export const leaveSchema = Joi.object({
    leaveType: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref('startDate')).required(),
    reason: Joi.string().min(10).max(500).required(),
});