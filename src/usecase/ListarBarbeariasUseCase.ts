// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
import { IBarbeariaRepository } from '../model/datasources/IBarbeariaRepository'
import { IListarBarbeariasUseCase } from './IListarBarbeariasUseCase'
import { Barbearia } from '../model/entities/Barbearia'

export class ListarBarbeariasUseCase implements IListarBarbeariasUseCase {
  constructor(private readonly barbeariaRepository: IBarbeariaRepository) {}

  async executar(): Promise<Barbearia[]> {
    return this.barbeariaRepository.listar()
  }
}
