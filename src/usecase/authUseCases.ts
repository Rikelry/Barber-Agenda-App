import type { IAuthDataSource } from "@/model/datasources/iAuthDataSource";
import type { Session } from "@/model/entities/session";
import { DomainError, ValidationError } from "@/model/errors";
import type { IAuthSessionService } from "@/model/services/iAuthSessionService";
import type { ISessionStorageService } from "@/model/services/iSessionStorageService";
import type {
  IAuthUseCases,
  LoginField,
  LoginForm,
  RegisterField,
  RegisterForm,
  ResetPasswordField,
  ResetPasswordForm,
} from "@/usecase/iAuthUseCases";

/** Mesma regra do backend (cadastroSchema e redefinirSenhaSchema). */
export const MIN_PASSWORD = 8;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isValidEmail = (email: string) => EMAIL.test(email.trim());
export const onlyDigits = (text: string) => text.replace(/\D/g, "");

const falhaSeHouver = <C extends string>(erros: Partial<Record<C, string>>) => {
  if (Object.keys(erros).length > 0) throw new ValidationError<C>(erros);
};

const errosDeSenha = (senha: string, confirmacao: string, campo: string, confirmacaoCampo: string) => {
  const erros: Record<string, string> = {};
  if (senha.length < MIN_PASSWORD) erros[campo] = `A senha precisa de pelo menos ${MIN_PASSWORD} caracteres.`;
  if (confirmacao !== senha) erros[confirmacaoCampo] = "As senhas não coincidem.";
  return erros;
};

export class AuthUseCases implements IAuthUseCases {
  constructor(
    private readonly dataSource: IAuthDataSource,
    private readonly session: IAuthSessionService,
    private readonly storage: ISessionStorageService,
  ) {}

  getSession(): Session | null {
    return this.session.getSession();
  }

  async restoreSession(): Promise<Session | null> {
    const atual = this.session.getSession();
    if (atual) return atual;
    const salva = await this.storage.load();
    if (salva) this.session.setSession(salva);
    return salva;
  }

  async login(form: LoginForm): Promise<Session> {
    const erros: Partial<Record<LoginField, string>> = {};
    if (!isValidEmail(form.email)) erros.email = "Informe um e-mail válido.";
    if (!form.password) erros.password = "Digite a sua senha.";
    falhaSeHouver(erros);

    const sessao = await this.dataSource.login(form.email.trim().toLowerCase(), form.password);
    this.session.setSession(sessao);
    await this.storage.save(sessao);
    return sessao;
  }

  async register(form: RegisterForm): Promise<Session> {
    const telefone = onlyDigits(form.phone);
    const erros: Partial<Record<RegisterField, string>> = {
      ...(errosDeSenha(form.password, form.confirmPassword, "password", "confirmPassword") as Partial<
        Record<RegisterField, string>
      >),
    };
    if (form.name.trim().length < 3) erros.name = "Informe o nome completo.";
    if (!isValidEmail(form.email)) erros.email = "Informe um e-mail válido.";
    if (telefone.length < 10 || telefone.length > 11) erros.phone = "Informe o telefone com DDD.";
    falhaSeHouver(erros);

    const email = form.email.trim().toLowerCase();
    await this.dataSource.register({ name: form.name.trim(), email, phone: telefone, password: form.password });
    return this.login({ email, password: form.password });
  }

  async requestPasswordReset(email: string): Promise<void> {
    if (!isValidEmail(email)) throw new ValidationError({ email: "Informe um e-mail válido." });
    await this.dataSource.requestPasswordReset(email.trim().toLowerCase());
  }

  async resetPassword(token: string, form: ResetPasswordForm): Promise<void> {
    if (!token) {
      throw new DomainError("Link de redefinição inválido. Peça um novo link.", "INVALID_DATA");
    }
    falhaSeHouver<ResetPasswordField>(
      errosDeSenha(form.newPassword, form.confirmPassword, "newPassword", "confirmPassword") as Partial<
        Record<ResetPasswordField, string>
      >,
    );
    await this.dataSource.resetPassword(token, form.newPassword);
  }

  async refreshSession(): Promise<Session | null> {
    if (!this.session.getSession()) return null;
    const nova = await this.dataSource.refreshToken();
    this.session.setSession(nova);
    await this.storage.save(nova);
    return nova;
  }

  logout(): void {
    this.session.setSession(null);
    void this.storage.save(null);
  }
}
