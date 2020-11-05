export const serverError = {
  description: 'Ocorreu um problema no servidor',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
