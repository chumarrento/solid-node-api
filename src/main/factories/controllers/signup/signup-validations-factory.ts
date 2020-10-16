import { ValidationComposite, RequiredFieldsValidation, CompareFieldsValidation, EmailValidation } from '../../../../validation/validators'
import { Validation } from '../../../../presentation/protocols/validation'
import { EmailValidatorAdapter } from '../../../../infra/validator/email-validator-adapter'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const fields = ['name', 'email', 'password', 'passwordConfirmation']
  fields.forEach(field => {
    validations.push(new RequiredFieldsValidation(field))
  })
  validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
