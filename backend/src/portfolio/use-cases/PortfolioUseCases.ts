import { FotoPortfolio } from '../domain/entidades/FotoPortfolio'
import { IPortfolioRepository } from '../domain/interfaces/IPortfolioRepository'
import {
  AdicionarFotoDTO,
  IAdicionarFotoPortfolioUseCase,
  IListarPortfolioUseCase,
  IRemoverFotoPortfolioUseCase,
} from '../domain/interfaces/IPortfolioUseCases'
import { IProfissionalRepository } from '../../professionals/domain/interfaces/IProfissionalRepository'
import { IServicoRepository } from '../../services/domain/interfaces/IServicoRepository'
import { AppError } from '../../shared/errors/AppError'

/** Quantas fotos marcadas aparecem nas Inspirações do Início. */
const LIMITE_DESTAQUES = 12

async function meuProfissional(profissionais: IProfissionalRepository, userId: string) {
  const profissional = await profissionais.buscarPorUserId(userId)
  if (!profissional) {
    throw new AppError('Só profissionais têm portfólio.', 403, 'NOT_A_PROFESSIONAL')
  }
  return profissional
}

/** Portfólio — qualquer usuário logado vê as fotos de um profissional ou de uma barbearia. */
export class ListarPortfolioUseCase implements IListarPortfolioUseCase {
  constructor(
    private readonly portfolio: IPortfolioRepository,
    private readonly profissionais: IProfissionalRepository
  ) {}

  porProfissional(professionalId: string): Promise<FotoPortfolio[]> {
    return this.portfolio.listarPorProfissional(professionalId)
  }

  porBarbearia(barbershopId: string): Promise<FotoPortfolio[]> {
    return this.portfolio.listarPorBarbearia(barbershopId)
  }

  async meu(userId: string): Promise<FotoPortfolio[]> {
    const profissional = await meuProfissional(this.profissionais, userId)
    return this.portfolio.listarPorProfissional(profissional.id)
  }

  destaques(): Promise<FotoPortfolio[]> {
    return this.portfolio.listarDestaques(LIMITE_DESTAQUES)
  }
}

/**
 * Portfólio — o profissional publica uma foto do próprio trabalho.
 * Exige a confirmação de que o cliente autorizou a publicação (LGPD) e, se houver
 * serviço, que ele seja da barbearia onde o profissional atende.
 */
export class AdicionarFotoPortfolioUseCase implements IAdicionarFotoPortfolioUseCase {
  constructor(
    private readonly portfolio: IPortfolioRepository,
    private readonly profissionais: IProfissionalRepository,
    private readonly servicos: IServicoRepository
  ) {}

  async executar(dados: AdicionarFotoDTO): Promise<FotoPortfolio> {
    const profissional = await meuProfissional(this.profissionais, dados.userId)
    if (!dados.clientConsent) {
      throw new AppError('Confirme que o cliente autorizou a publicação da foto.', 400, 'CONSENT_REQUIRED')
    }
    if (dados.serviceId) {
      const servico = await this.servicos.buscarPorId(dados.serviceId, profissional.barbershopId)
      if (!servico) throw new AppError('Serviço não encontrado nesta barbearia.', 404, 'SERVICE_NOT_FOUND')
    }
    return this.portfolio.criar({
      professionalId: profissional.id,
      imageUrl: dados.imageUrl,
      caption: dados.caption?.trim() || null,
      serviceId: dados.serviceId ?? null,
      featured: dados.featured ?? false,
      clientConsent: true,
    })
  }
}

/** Portfólio — só o dono da foto (o profissional que publicou) pode removê-la. */
export class RemoverFotoPortfolioUseCase implements IRemoverFotoPortfolioUseCase {
  constructor(
    private readonly portfolio: IPortfolioRepository,
    private readonly profissionais: IProfissionalRepository
  ) {}

  async executar(fotoId: string, userId: string): Promise<void> {
    const profissional = await meuProfissional(this.profissionais, userId)
    const foto = await this.portfolio.buscarPorId(fotoId)
    if (!foto) throw new AppError('Foto não encontrada.', 404, 'PHOTO_NOT_FOUND')
    if (foto.professionalId !== profissional.id) {
      throw new AppError('Você não tem permissão para acessar este recurso.', 403, 'FORBIDDEN')
    }
    await this.portfolio.remover(fotoId)
  }
}
