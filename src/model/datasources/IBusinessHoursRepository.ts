// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { BusinessHours } from '../entities/HorarioFuncionamento'

export interface IBusinessHoursRepository {
  salvar(data: Omit<BusinessHours, 'id'>): Promise<BusinessHours>
  listarPorBarbeariaId(barbershopId: string): Promise<BusinessHours[]>
  atualizar(id: string, data: Partial<Omit<BusinessHours, 'id' | 'barbershopId'>>): Promise<BusinessHours>
}

