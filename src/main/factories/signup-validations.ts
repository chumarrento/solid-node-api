import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite'
import { Validation } from '../../presentation/helpers/validators/validation'
import { RequiredFieldsValidation } from '../../presentation/helpers/validators/required-fields-validation'

export const makeSignUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const fields = ['name', 'email', 'password', 'passwordConfirmation']
  fields.forEach(field => {
    validations.push(new RequiredFieldsValidation(field))
  })
  return new ValidationComposite(validations)
}
