// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
export interface IListarHorariosDisponiveisUseCase {
  executar(barbershopId: string, professionalId: string, date: string, serviceId: string): Promise<string[]>
}
