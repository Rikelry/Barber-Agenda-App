import type { Session } from "@/model/entities/session";
import type { IAuthSessionService } from "@/model/services/iAuthSessionService";

/** Sessão guardada só em memória: some ao fechar o app. */
export class MemoryAuthSessionService implements IAuthSessionService {
  private token: string | null = null;
  private session: Session | null = null;

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string | null): void {
    this.token = token;
    if (token === null) this.session = null;
  }

  getSession(): Session | null {
    return this.session;
  }

  setSession(session: Session | null): void {
    this.session = session;
    this.token = session?.token ?? null;
  }
}
