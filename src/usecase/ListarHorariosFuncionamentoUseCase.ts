// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { BusinessHours } from '../model/entities/HorarioFuncionamento'
import { IBusinessHoursRepository } from '../model/datasources/IBusinessHoursRepository'

export class ListarHorariosFuncionamentoUseCase {
  constructor(
    private readonly businessHoursRepository: IBusinessHoursRepository
  ) {}

  async executar(barbershopId: string): Promise<BusinessHours[]> {
    return await this.businessHoursRepository.listarPorBarbeariaId(barbershopId)
  }
}
