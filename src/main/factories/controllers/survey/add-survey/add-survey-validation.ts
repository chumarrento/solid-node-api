import { Validation } from '@/presentation/protocols'
import { RequiredFieldsValidation, ValidationComposite } from '@/validation/validators'

export const makeAddSurveyValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const fields = ['question', 'answers']
  fields.forEach(field => {
    validations.push(new RequiredFieldsValidation(field))
  })
  return new ValidationComposite(validations)
}
