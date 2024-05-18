import Validator, { Register } from "../../../src/app/module/account/account.model"

test('payload register should be validated', () => {
    const payload: Register = {
        name: 'arip',
        email: 'arip@email.com',
        password: 'Ripdn9422@'
    }

    const v = Validator.register(payload)
    const validationResult = v.validate()

    expect(validationResult.error).toBe(undefined)
})