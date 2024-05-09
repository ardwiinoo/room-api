import { Request, Response, NextFunction } from 'express'
import { Validator } from '../../lib/validator'

export type ValidatorMiddleware = (data: any) => Validator

export function validate(validator: ValidatorMiddleware) {
    return (req: Request, res: Response, next: NextFunction) => {
        const v = validator(req.body)
        const { error } = v.validate()

        if (error) {
            res.status(400).send({
                code: 400,
                message: error.details.map(detail => detail.message),
                data: null
            })
        } else {
            next()
        }
    }
}