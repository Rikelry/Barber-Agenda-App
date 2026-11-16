import { describe, expect, it, jest } from "@jest/globals";

import { MemoryAuthSessionService } from "@/infra/services/memoryAuthSessionService";
import type { IAuthDataSource } from "@/model/datasources/iAuthDataSource";
import type { Session } from "@/model/entities/session";
import { DomainError, ValidationError } from "@/model/errors";
import { AuthUseCases } from "@/usecase/authUseCases";

const SESSAO: Session = {
  token: "jwt",
  user: { id: "u1", name: "Lucas", email: "lucas@mail.com", phone: "11999999999", avatarUrl: null, memberSince: new Date() },
  roles: ["cliente"],
};

const montar = () => {
  const fonte: jest.Mocked<IAuthDataSource> = {
    login: jest.fn(async () => SESSAO),
    register: jest.fn(async () => undefined),
    requestPasswordReset: jest.fn(async () => undefined),
    resetPassword: jest.fn(async () => undefined),
    refreshToken: jest.fn(async () => ({ ...SESSAO, token: "jwt-novo", roles: ["cliente", "owner"] as Session["roles"] })),
  };
  const sessao = new MemoryAuthSessionService();
  let guardada: Session | null = null;
  const armazenamento = {
    load: jest.fn(async () => guardada),
    save: jest.fn(async (s: Session | null) => {
      guardada = s;
    }),
  };
  return { fonte, sessao, armazenamento, casos: new AuthUseCases(fonte, sessao, armazenamento) };
};

const campos = async (p: Promise<unknown>) => ((await p.catch((e: unknown) => e)) as ValidationError).fields;

describe("AuthUseCases", () => {
  it("login valida, normaliza o e-mail e guarda a sessão", async () => {
    const { fonte, sessao, casos } = montar();
    expect(await campos(casos.login({ email: "x", password: "" }))).toEqual({
      email: "Informe um e-mail válido.",
      password: "Digite a sua senha.",
    });
    await casos.login({ email: " Lucas@Mail.com ", password: "12345678" });
    expect(fonte.login).toHaveBeenCalledWith("lucas@mail.com", "12345678");
    expect(sessao.getToken()).toBe("jwt");
    expect(casos.getSession()?.user.name).toBe("Lucas");
    casos.logout();
    expect(sessao.getToken()).toBeNull();
  });

  it("guarda a sessão ao entrar e a recupera ao abrir o app; sair apaga", async () => {
    const { armazenamento, casos } = montar();
    expect(await casos.restoreSession()).toBeNull();
    await casos.login({ email: "lucas@mail.com", password: "12345678" });
    expect(armazenamento.save).toHaveBeenLastCalledWith(SESSAO);

    const reaberto = new AuthUseCases(montar().fonte, new MemoryAuthSessionService(), armazenamento);
    expect((await reaberto.restoreSession())?.token).toBe("jwt");
    expect(reaberto.getSession()?.user.name).toBe("Lucas");

    expect((await reaberto.refreshSession())?.roles).toEqual(["cliente", "owner"]);
    expect(armazenamento.save).toHaveBeenLastCalledWith(expect.objectContaining({ token: "jwt-novo" }));
    reaberto.logout();
    expect(armazenamento.save).toHaveBeenLastCalledWith(null);
  });

  it("cadastro valida os campos, envia o telefone só com dígitos e entra na conta", async () => {
    const { fonte, casos } = montar();
    expect(
      await campos(casos.register({ name: "Lu", email: "a", phone: "999", password: "123", confirmPassword: "1234" })),
    ).toEqual({
      name: "Informe o nome completo.",
      email: "Informe um e-mail válido.",
      phone: "Informe o telefone com DDD.",
      password: "A senha precisa de pelo menos 8 caracteres.",
      confirmPassword: "As senhas não coincidem.",
    });
    const sessao = await casos.register({
      name: "Lucas Silva",
      email: "lucas@mail.com",
      phone: "(11) 99999-9999",
      password: "senhaForte1",
      confirmPassword: "senhaForte1",
    });
    expect(fonte.register).toHaveBeenCalledWith({
      name: "Lucas Silva",
      email: "lucas@mail.com",
      phone: "11999999999",
      password: "senhaForte1",
    });
    expect(fonte.login).toHaveBeenCalledWith("lucas@mail.com", "senhaForte1");
    expect(sessao.token).toBe("jwt");
  });

  it("recuperação e redefinição de senha validam antes de chamar a API", async () => {
    const { fonte, casos } = montar();
    expect(await campos(casos.requestPasswordReset("errado"))).toEqual({ email: "Informe um e-mail válido." });
    await casos.requestPasswordReset("lucas@mail.com");
    expect(fonte.requestPasswordReset).toHaveBeenCalledWith("lucas@mail.com");

    await expect(casos.resetPassword("", { newPassword: "senhaForte1", confirmPassword: "senhaForte1" })).rejects.toBeInstanceOf(
      DomainError,
    );
    expect(await campos(casos.resetPassword("tk", { newPassword: "senhaForte1", confirmPassword: "outra" }))).toEqual({
      confirmPassword: "As senhas não coincidem.",
    });
    await casos.resetPassword("tk", { newPassword: "senhaForte1", confirmPassword: "senhaForte1" });
    expect(fonte.resetPassword).toHaveBeenCalledWith("tk", "senhaForte1");
  });
});
