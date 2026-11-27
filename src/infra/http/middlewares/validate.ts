// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Dados inválidos na requisição.',
        details: result.error.flatten().fieldErrors,
      })
    }

    req.body = result.data
    next()
  }
}