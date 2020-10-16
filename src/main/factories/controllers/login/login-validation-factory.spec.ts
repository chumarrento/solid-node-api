import { Validation } from '../../../../presentation/protocols/validation'
import { EmailValidation, ValidationComposite, RequiredFieldsValidation } from '../../../../validation/validators'
import { EmailValidator } from '../../../../validation/protocols/email-validator'
import { makeLoginValidation } from './login-validation-factory'

jest.mock('../../../../validation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

describe('LoginValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation()
    const validations: Validation[] = []
    const fields = ['email', 'password']
    fields.forEach(field => {
      validations.push(new RequiredFieldsValidation(field))
    })
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
