import type { IAuthSessionService } from "@/model/services/iAuthSessionService";

/** Token guardado só em memória: some ao fechar o app (até existir a tela de login com persistência). */
export class MemoryAuthSessionService implements IAuthSessionService {
  private token: string | null = null;

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string | null): void {
    this.token = token;
  }
}
