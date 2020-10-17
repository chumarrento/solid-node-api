import { Validation } from '../../../../presentation/protocols'
import { RequiredFieldsValidation, ValidationComposite } from '../../../../validation/validators'
import { makeAddSurveyValidation } from './add-survey-validation'

jest.mock('../../../../validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = []
    const fields = ['question', 'answers']
    fields.forEach(field => {
      validations.push(new RequiredFieldsValidation(field))
    })
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
