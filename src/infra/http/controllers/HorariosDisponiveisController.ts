// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { Request, Response, NextFunction } from 'express'
import { IListarHorariosDisponiveisUseCase } from '../../../usecase/IListarHorariosDisponiveisUseCase'
import { horariosDisponiveisQuerySchema } from '../schemas/HorariosDisponiveisSchema'
import { AppError } from '../../errors/AppError'

export class HorariosDisponiveisController {
  constructor(private readonly listarHorariosDisponiveisUseCase: IListarHorariosDisponiveisUseCase) {}

  // RF022 — Horários livres de um profissional numa data, para um serviço
  async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = horariosDisponiveisQuerySchema.safeParse(req.query)

      if (!query.success) {
        throw new AppError('Data ou serviço inválido na consulta.', 400, 'VALIDATION_ERROR')
      }

      const slots = await this.listarHorariosDisponiveisUseCase.executar(
        req.params.barbershopId as string,
        req.params.professionalId as string,
        query.data.date,
        query.data.serviceId
      )

      res.status(200).json({ slots })
    } catch (error) {
      next(error)
    }
  }
}
