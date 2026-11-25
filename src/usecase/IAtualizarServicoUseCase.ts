// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { AtualizarServicoDTO, ServicoResponseDTO } from '../infra/http/dtos/ServicoDTO'

export interface IAtualizarServicoUseCase {
  executar(dados: AtualizarServicoDTO & { ownerId: string; serviceId: string }): Promise<ServicoResponseDTO>
}
