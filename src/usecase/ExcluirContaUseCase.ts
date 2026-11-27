// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IExcluirContaUseCase } from './IExcluirContaUseCase'
import { IUsuarioRepository } from '../model/datasources/IUsuarioRepository'
import { AppError } from '../infra/errors/AppError'

export class ExcluirContaUseCase implements IExcluirContaUseCase {
  constructor(private usuarioRepository: IUsuarioRepository) {}

  async execute(id: string): Promise<void> {
    const usuario = await this.usuarioRepository.buscarPorId(id)
    if (!usuario) {
      throw new AppError('Usuário não encontrado', 404, 'USER_NOT_FOUND'
)
    }

    // TODO: Cancelar agendamentos futuros (Módulo 3)

    try {
      await this.usuarioRepository.deletar(id)
    } catch {
      // Falha aqui quase sempre é FK (agendamentos, barbearias, vínculo de
      // profissional) — não expõe o erro de banco cru pro usuário final.
      throw new AppError(
        'Não foi possível excluir sua conta agora porque existem barbearias, agendamentos ou vínculos associados a ela.',
        409,
        'ACCOUNT_HAS_DEPENDENCIES'
      )
    }
  }
}
