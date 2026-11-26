/** Credencial devolvida pelo Google no aparelho, pronta para o backend validar. */
export type GoogleCredential = { idToken: string };

export interface IGoogleAuthService {
  /** Abre o seletor de contas do Google e devolve o ID token.
   *  Falha com DomainError CANCELLED quando o usuário fecha o seletor. */
  signIn(): Promise<GoogleCredential>;
}
