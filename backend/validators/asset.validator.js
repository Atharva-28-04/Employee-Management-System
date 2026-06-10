import Joi from 'joi';

export const assetSchema = Joi.object({
    assetName: Joi.string().min(2).max(100).required(),
    assetType: Joi.string().required(),
    serialNumber: Joi.string().optional(),
    purchaseDate: Joi.date().optional(),
    value: Joi.number().positive().optional(),
});