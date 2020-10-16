import { ErrorRequestHandler } from 'express'
import { ValidationError } from 'yup'

interface ValidationErrors {
  [key: string]: string[]
}

const erroHandler: ErrorRequestHandler = (error, request, response, next) => {
  console.error(error)

  if (error instanceof ValidationError) {
    const errors: ValidationErrors = {}

    error.inner.map(err => {
      errors[err.path] = err.errors
    })

    return response.json({ message: 'validation fail', errors })
  }

  return response.sendStatus(500)
}

export default erroHandler
