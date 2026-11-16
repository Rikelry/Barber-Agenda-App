import type { Session } from "@/model/entities/session";

/** Sessão do usuário logado: o token JWT que a API exige e os dados do usuário. */
export interface IAuthSessionService {
  getToken(): string | null;
  setToken(token: string | null): void;
  getSession(): Session | null;
  /** null encerra a sessão. */
  setSession(session: Session | null): void;
}
