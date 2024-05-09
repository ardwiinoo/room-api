import Joi from 'joi'

export interface Validator {
    validate(): Joi.ValidationResult
}

export function validateSchema(schema: Joi.ObjectSchema, data: any): Joi.ValidationResult {
    return schema.validate(data)
}