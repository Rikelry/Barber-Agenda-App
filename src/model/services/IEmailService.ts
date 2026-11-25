// @servidor — servidor Express. Não é código do MVVM do app e não está sujeito às suas regras.
export interface IEmailService {
  enviarEmailRecuperacaoSenha(destinatario: string, linkRedefinicao: string): Promise<void>
}
