// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { Request, Response, NextFunction } from 'express'
import { ICadastrarProfissionalUseCase } from '../../../usecase/ICadastrarProfissionalUseCase'
import { IListarProfissionaisUseCase } from '../../../usecase/IListarProfissionaisUseCase'
import { IBuscarProfissionalUseCase } from '../../../usecase/IBuscarProfissionalUseCase'
import { IAtualizarProfissionalUseCase } from '../../../usecase/IAtualizarProfissionalUseCase'
import { IRemoverProfissionalUseCase } from '../../../usecase/IRemoverProfissionalUseCase'
import { ITornarSeProfissionalUseCase } from '../../../usecase/ITornarSeProfissionalUseCase'
import { IBuscarMeuProfissionalUseCase } from '../../../usecase/IBuscarMeuProfissionalUseCase'
import { AppError } from '../../errors/AppError'

export class ProfissionalController {
  constructor(
    private readonly cadastrarProfissionalUseCase: ICadastrarProfissionalUseCase,
    private readonly listarProfissionaisUseCase: IListarProfissionaisUseCase,
    private readonly buscarProfissionalUseCase: IBuscarProfissionalUseCase,
    private readonly atualizarProfissionalUseCase: IAtualizarProfissionalUseCase,
    private readonly removerProfissionalUseCase: IRemoverProfissionalUseCase,
    private readonly tornarSeProfissionalUseCase: ITornarSeProfissionalUseCase,
    private readonly buscarMeuProfissionalUseCase: IBuscarMeuProfissionalUseCase
  ) {}

  // Vínculo de profissional do próprio usuário logado (id + barbershopId)
  async buscarMeuProfissional(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.usuario) {
        throw new AppError('Usuário não autenticado.', 401, 'UNAUTHORIZED')
      }

      const barbershopId = typeof req.query.barbershopId === 'string' ? req.query.barbershopId : undefined
      const profissional = await this.buscarMeuProfissionalUseCase.executar(req.usuario.id, barbershopId)

      res.status(200).json(profissional)
    } catch (error) {
      next(error)
    }
  }

  // Todos os vínculos de profissional do usuário logado (uma linha por barbearia)
  async listarMeusVinculos(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.usuario) {
        throw new AppError('Usuário não autenticado.', 401, 'UNAUTHORIZED')
      }
      res.status(200).json({ vinculos: await this.buscarMeuProfissionalUseCase.listar(req.usuario.id) })
    } catch (error) {
      next(error)
    }
  }

  // Owner se auto-cadastra como profissional na própria barbearia
  async tornarSeProfissional(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.usuario) {
        throw new AppError('Usuário não autenticado.', 401, 'UNAUTHORIZED')
      }

      const profissional = await this.tornarSeProfissionalUseCase.executar({
        barbershopId: req.params.barbershopId as string,
        ownerId: req.usuario.id,
        specialty: req.body.specialty,
      })

      res.status(201).json(profissional)
    } catch (error) {
      next(error)
    }
  }

  // RF003 — Cadastro de profissionais na barbearia (owner)
  async cadastrar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.usuario) {
        throw new AppError('Usuário não autenticado.', 401, 'UNAUTHORIZED')
      }

      const { name, email, phone, password, specialty } = req.body

      const profissional = await this.cadastrarProfissionalUseCase.executar({
        name,
        email,
        phone,
        password,
        specialty,
        barbershopId: req.params.barbershopId as string,
        ownerId: req.usuario.id,
      })

      res.status(201).json(profissional)
    } catch (error) {
      next(error)
    }
  }

  // RF004 — Listagem de profissionais da barbearia
  async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profissionais = await this.listarProfissionaisUseCase.executar(req.params.barbershopId as string)
      res.status(200).json(profissionais)
    } catch (error) {
      next(error)
    }
  }

  // RF026 — Dados do profissional (detalhe)
  async buscarPorId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profissional = await this.buscarProfissionalUseCase.executar(
        req.params.barbershopId as string,
        req.params.id as string
      )
      res.status(200).json(profissional)
    } catch (error) {
      next(error)
    }
  }

  // Edição de profissional (owner)
  async atualizar(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.usuario) {
        throw new AppError('Usuário não autenticado.', 401, 'UNAUTHORIZED')
      }

      const { name, phone, specialty } = req.body

      const profissional = await this.atualizarProfissionalUseCase.executar({
        barbershopId: req.params.barbershopId as string,
        professionalId: req.params.id as string,
        ownerId: req.usuario.id,
        name,
        phone,
        specialty,
      })

      res.status(200).json(profissional)
    } catch (error) {
      next(error)
    }
  }

  // Remoção de profissional (owner)
  async remover(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.usuario) {
        throw new AppError('Usuário não autenticado.', 401, 'UNAUTHORIZED')
      }

      await this.removerProfissionalUseCase.executar({
        barbershopId: req.params.barbershopId as string,
        professionalId: req.params.id as string,
        ownerId: req.usuario.id,
      })

      res.status(204).send()
    } catch (error) {
      next(error)
    }
  }
}
