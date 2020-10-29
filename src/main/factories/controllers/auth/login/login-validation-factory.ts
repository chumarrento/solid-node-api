import { ValidationComposite, EmailValidation, RequiredFieldsValidation } from '@/validation/validators'
import { Validation } from '@/presentation/protocols/validation'
import { EmailValidatorAdapter } from '@/infra/validator/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const fields = ['email', 'password']
  fields.forEach(field => {
    validations.push(new RequiredFieldsValidation(field))
  })
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
