import type { Session } from "@/model/entities/session";

export type RegisterData = {
  name: string;
  email: string;
  /** Só dígitos, com DDD. */
  phone: string;
  password: string;
};

export interface IAuthDataSource {
  /** Falha com DomainError UNAUTHORIZED quando e-mail ou senha não conferem. */
  login(email: string, password: string): Promise<Session>;
  /** Falha com ValidationError({ email }) quando o e-mail já está cadastrado. */
  register(data: RegisterData): Promise<void>;
  /** Envia por e-mail o link para redefinir a senha. */
  requestPasswordReset(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  /** Novo token com os papéis atualizados (ex.: depois de criar a primeira barbearia). */
  refreshToken(): Promise<Session>;
}
