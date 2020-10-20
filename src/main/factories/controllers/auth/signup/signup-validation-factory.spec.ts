import { makeSignUpValidation } from './signup-validations-factory'
import { ValidationComposite, RequiredFieldsValidation, EmailValidation, CompareFieldsValidation } from '../../../../../validation/validators'
import { Validation } from '../../../../../presentation/protocols/validation'
import { EmailValidator } from '../../../../../validation/protocols/email-validator'

jest.mock('../../../../../validation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation()
    const validations: Validation[] = []
    const fields = ['name', 'email', 'password', 'passwordConfirmation']
    fields.forEach(field => {
      validations.push(new RequiredFieldsValidation(field))
    })
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
