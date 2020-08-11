import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { Validation } from '../../../presentation/helpers/validators/validation'
import { RequiredFieldsValidation } from '../../../presentation/helpers/validators/required-fields-validation'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validator'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeLoginValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const fields = ['email', 'password']
  fields.forEach(field => {
    validations.push(new RequiredFieldsValidation(field))
  })
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
