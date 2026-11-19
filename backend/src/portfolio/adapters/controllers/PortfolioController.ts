import { Request, Response, NextFunction } from 'express'
import {
  IAdicionarFotoPortfolioUseCase,
  IListarPortfolioUseCase,
  IRemoverFotoPortfolioUseCase,
} from '../../domain/interfaces/IPortfolioUseCases'
import { AppError } from '../../../shared/errors/AppError'

const usuario = (req: Request) => {
  if (!req.usuario) throw new AppError('Usuário não autenticado.', 401, 'UNAUTHORIZED')
  return req.usuario
}

export class PortfolioController {
  constructor(
    private readonly listar: IListarPortfolioUseCase,
    private readonly adicionar: IAdicionarFotoPortfolioUseCase,
    private readonly remover: IRemoverFotoPortfolioUseCase
  ) {}

  async doProfissional(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      usuario(req)
      res.status(200).json(await this.listar.porProfissional(req.params.professionalId as string))
    } catch (e) {
      next(e)
    }
  }

  async daBarbearia(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      usuario(req)
      res.status(200).json(await this.listar.porBarbearia(req.params.barbershopId as string))
    } catch (e) {
      next(e)
    }
  }

  async meu(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.status(200).json(await this.listar.meu(usuario(req).id))
    } catch (e) {
      next(e)
    }
  }

  async destaques(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      usuario(req)
      res.status(200).json(await this.listar.destaques())
    } catch (e) {
      next(e)
    }
  }

  async publicar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { imageUrl, caption, serviceId, featured, clientConsent } = req.body
      const foto = await this.adicionar.executar({ userId: usuario(req).id, imageUrl, caption, serviceId, featured, clientConsent })
      res.status(201).json(foto)
    } catch (e) {
      next(e)
    }
  }

  async excluir(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await this.remover.executar(req.params.id as string, usuario(req).id)
      res.status(204).send()
    } catch (e) {
      next(e)
    }
  }
}
