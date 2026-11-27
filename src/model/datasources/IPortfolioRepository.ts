// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { FotoPortfolio, NovaFotoPortfolio } from '../entities/FotoPortfolio'

export interface IPortfolioRepository {
  listarPorProfissional(professionalId: string): Promise<FotoPortfolio[]>
  listarPorBarbearia(barbershopId: string): Promise<FotoPortfolio[]>
  listarDestaques(limite: number): Promise<FotoPortfolio[]>
  buscarPorId(id: string): Promise<FotoPortfolio | null>
  criar(dados: NovaFotoPortfolio): Promise<FotoPortfolio>
  remover(id: string): Promise<void>
}
