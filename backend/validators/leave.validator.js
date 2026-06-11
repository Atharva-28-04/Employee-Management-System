import Joi from 'joi';

export const leaveSchema = Joi.object({
  employeeId: Joi.number().required(),
  leaveTypeId: Joi.number().required(),
  fromDate: Joi.date().required(),
  toDate: Joi.date().required(),
  reason: Joi.string().required()
});