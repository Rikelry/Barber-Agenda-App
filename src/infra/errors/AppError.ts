// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
// shared/errors/AppError.ts
export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: string

  constructor(message: string, statusCode: number, code: string) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    Object.setPrototypeOf(this, AppError.prototype)
  }
}