import { FotoPortfolio, NovaFotoPortfolio } from '../entidades/FotoPortfolio'

export interface IPortfolioRepository {
  listarPorProfissional(professionalId: string): Promise<FotoPortfolio[]>
  listarPorBarbearia(barbershopId: string): Promise<FotoPortfolio[]>
  listarDestaques(limite: number): Promise<FotoPortfolio[]>
  buscarPorId(id: string): Promise<FotoPortfolio | null>
  criar(dados: NovaFotoPortfolio): Promise<FotoPortfolio>
  remover(id: string): Promise<void>
}
