import { RequiredFieldsValidation } from './required-fields-validation'
import { MissingParamError } from '../../errors'

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = new RequiredFieldsValidation('any_field')
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('any_field'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = new RequiredFieldsValidation('any_field')
    const error = sut.validate({ any_field: 'any_value' })
    expect(error).toBeFalsy()
  })
})
