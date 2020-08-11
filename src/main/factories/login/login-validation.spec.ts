import { Validation } from '../../../presentation/protocols/validation'
import { RequiredFieldsValidation } from '../../../presentation/helpers/validators/required-fields-validation'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validator'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { makeLoginValidation } from './login-validation'

jest.mock('../../../presentation/helpers/validators/validation-composite')

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
