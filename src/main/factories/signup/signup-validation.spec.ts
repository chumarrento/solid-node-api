import { makeSignUpValidation } from './signup-validations'
import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { Validation } from '../../../presentation/protocols/validation'
import { RequiredFieldsValidation } from '../../../presentation/helpers/validators/required-fields-validation'
import { CompareFieldsValidation } from '../../../presentation/helpers/validators/compare-fields-validation'
import { EmailValidator } from '../../../presentation/protocols/email-validator'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validator'

jest.mock('../../../presentation/helpers/validators/validation-composite')

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
