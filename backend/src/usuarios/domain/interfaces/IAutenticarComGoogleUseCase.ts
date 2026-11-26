import { GoogleLoginDTO, LoginResponseDTO } from '../../adapters/dtos/UsuarioDTO'

export interface IAutenticarComGoogleUseCase {
  executar(dados: GoogleLoginDTO): Promise<LoginResponseDTO>
}
