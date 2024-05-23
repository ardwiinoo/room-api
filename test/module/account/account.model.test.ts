import Validator, { Register } from "../../../src/app/module/account/account.model"

describe('Register Validation', () => {
    test('should pass when all fields are valid', () => {
        const payload: Register = {
            name: 'arip',
            email: 'arip@email.com',
            password: 'Ripdn9422@'
        }

        const v = Validator.register(payload)
        const validationResult = v.validate()

        expect(validationResult.error).toBe(undefined)
    })

    test('should fail when email is not valid', () => {
        const payload: Register = {
            name: 'arip',
            email: 'invalid email',
            password: 'Ripdn9422@'
        }

        const v = Validator.register(payload)
        const validationResult = v.validate()

        expect(validationResult.error).not.toBe(undefined)
    })
})

describe('Login Validation', () => {
    test('should pass when all fields are valid', () => {
        const payload = {
            email: 'arip@email.com',
            password: 'Ripdn9422@'
        }

        const v = Validator.login(payload)
        const validationResult = v.validate()

        expect(validationResult.error).toBe(undefined)
    })

    test('should fail when email is not valid', () => {
        const payload = {
            email: 'invalid email',
            password: 'Ripdn9422@'
        }

        const v = Validator.login(payload)
        const validationResult = v.validate()

        expect(validationResult.error).not.toBe(undefined)
    })
})