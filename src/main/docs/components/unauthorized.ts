export const unauthorized = {
  description: 'Crendedenciais inválidas',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
