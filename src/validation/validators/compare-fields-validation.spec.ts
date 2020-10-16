import { CompareFieldsValidation } from './compare-fields-validation'
import { InvalidParamError } from '../../presentation/errors'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('any_field', 'any_field_to_compare')
}

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({
      any_field: 'any_value',
      any_field_to_compare: 'wrong_value'
    })
    expect(error).toEqual(new InvalidParamError('any_field_to_compare'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({
      any_field: 'any_value',
      any_field_to_compare: 'any_value'
    })
    expect(error).toBeFalsy()
  })
})
