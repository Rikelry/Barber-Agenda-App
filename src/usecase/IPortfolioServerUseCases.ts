// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { FotoPortfolio } from '../model/entities/FotoPortfolio'

export interface AdicionarFotoDTO {
  userId: string
  imageUrl: string
  caption?: string | null
  serviceId?: string | null
  featured?: boolean
  clientConsent: boolean
}

export interface IListarPortfolioUseCase {
  porProfissional(professionalId: string): Promise<FotoPortfolio[]>
  porBarbearia(barbershopId: string): Promise<FotoPortfolio[]>
  meu(userId: string): Promise<FotoPortfolio[]>
  destaques(): Promise<FotoPortfolio[]>
}

export interface IAdicionarFotoPortfolioUseCase {
  executar(dados: AdicionarFotoDTO): Promise<FotoPortfolio>
}

export interface IRemoverFotoPortfolioUseCase {
  executar(fotoId: string, userId: string): Promise<void>
}
