/** Sessão do usuário logado: o token JWT que a API exige em todas as rotas. */
export interface IAuthSessionService {
  getToken(): string | null;
  setToken(token: string | null): void;
}
