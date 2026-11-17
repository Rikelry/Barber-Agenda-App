import type { Session } from "@/model/entities/session";

export type LoginForm = { email: string; password: string };
export type LoginField = keyof LoginForm;

export type RegisterForm = {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};
export type RegisterField = keyof RegisterForm;

export type ResetPasswordForm = { newPassword: string; confirmPassword: string };
export type ResetPasswordField = keyof ResetPasswordForm;

export interface IAuthUseCases {
  /** Sessão atual ou null quando ninguém entrou. */
  getSession(): Session | null;
  /** Ao abrir o app: recupera a sessão guardada no aparelho, se houver. */
  restoreSession(): Promise<Session | null>;
  login(form: LoginForm): Promise<Session>;
  /** Cria a conta e já entra nela. */
  register(form: RegisterForm): Promise<Session>;
  requestPasswordReset(email: string): Promise<void>;
  resetPassword(token: string, form: ResetPasswordForm): Promise<void>;
  logout(): void;
  /** Atualiza token e papéis da sessão atual. */
  refreshSession(): Promise<Session | null>;
}
