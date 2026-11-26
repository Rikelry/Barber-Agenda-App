import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { HttpAuthDataSource } from "@/infra/datasources/httpAuthDataSource";
import { HttpUserDataSource } from "@/infra/datasources/httpUserDataSource";
import { HttpClient } from "@/infra/http/httpClient";
import { MemoryAuthSessionService } from "@/infra/services/memoryAuthSessionService";
import { ValidationError } from "@/model/errors";

type Init = { method: string; headers: Record<string, string>; body?: string };
let fetchMock: jest.Mock<(url: string, init: Init) => Promise<Response>>;
const resposta = (corpo: unknown, status = 200) =>
  ({ status, ok: status >= 200 && status < 300, json: async () => corpo }) as unknown as Response;
const fonte = () => new HttpAuthDataSource(new HttpClient(new MemoryAuthSessionService(), "http://api.teste/api/v1"));

beforeEach(() => {
  fetchMock = jest.fn();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
});

describe("HttpAuthDataSource", () => {
  it("login envia POST com JSON e converte a sessão", async () => {
    fetchMock.mockResolvedValue(
      resposta({
        token: "jwt",
        usuario: { id: "u1", name: "Lucas", email: "l@mail.com", phone: "11999999999", role: "cliente", roles: ["cliente", "owner"], createdAt: "2024-01-15T10:00:00Z" },
      }),
    );
    const sessao = await fonte().login("l@mail.com", "segredo12");
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("http://api.teste/api/v1/auth/login");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body!)).toEqual({ email: "l@mail.com", password: "segredo12" });
    expect(sessao).toMatchObject({ token: "jwt", roles: ["cliente", "owner"], user: { name: "Lucas" } });
    expect(sessao.user.memberSince.getUTCFullYear()).toBe(2024);
  });

  it("traduz os erros do backend: credenciais, e-mail repetido e validação por campo", async () => {
    fetchMock.mockResolvedValueOnce(resposta({ error: "INVALID_CREDENTIALS", message: "E-mail ou senha inválidos." }, 401));
    await expect(fonte().login("l@mail.com", "x")).rejects.toMatchObject({ code: "UNAUTHORIZED", message: "E-mail ou senha inválidos." });

    fetchMock.mockResolvedValueOnce(resposta({ error: "EMAIL_ALREADY_EXISTS", message: "E-mail já cadastrado." }, 409));
    const repetido = await fonte()
      .register({ name: "Lucas", email: "l@mail.com", phone: "11999999999", password: "segredo12" })
      .catch((e: unknown) => e);
    expect((repetido as ValidationError).fields).toEqual({ email: "E-mail já cadastrado." });

    fetchMock.mockResolvedValueOnce(
      resposta({ error: "VALIDATION_ERROR", message: "Dados inválidos.", details: { newPassword: ["Senha deve ter no mínimo 8 caracteres"] } }, 400),
    );
    const invalido = await fonte().resetPassword("tk", "123").catch((e: unknown) => e);
    expect((invalido as ValidationError).fields).toEqual({ newPassword: "Senha deve ter no mínimo 8 caracteres" });
    expect(fetchMock.mock.calls[2]![1].method).toBe("PATCH");
  });

  it("token de redefinição expirado vira mensagem do backend", async () => {
    fetchMock.mockResolvedValue(resposta({ error: "INVALID_RESET_TOKEN", message: "Token inválido ou expirado." }, 400));
    await expect(fonte().resetPassword("velho", "segredo12")).rejects.toMatchObject({ message: "Token inválido ou expirado." });
  });

  it("login com Google envia POST /auth/google com o idToken e traz foto e nome", async () => {
    fetchMock.mockResolvedValue(
      resposta({
        token: "jwt",
        usuario: { id: "g1", name: "Ana Souza", email: "ana@mail.com", phone: "", avatarUrl: "https://fotos/ana.png", createdAt: "2024-01-15T10:00:00Z" },
      }),
    );
    const sessao = await fonte().loginWithGoogle("id-token");
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("http://api.teste/api/v1/auth/google");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body!)).toEqual({ idToken: "id-token" });
    expect(sessao.user).toMatchObject({ name: "Ana Souza", avatarUrl: "https://fotos/ana.png" });
  });

  it("token do Google recusado pelo backend vira mensagem clara", async () => {
    fetchMock.mockResolvedValue(
      resposta({ error: "INVALID_GOOGLE_TOKEN", message: "Não foi possível validar a sua conta Google. Tente novamente." }, 401),
    );
    await expect(fonte().loginWithGoogle("expirado")).rejects.toMatchObject({
      code: "UNAUTHORIZED",
      message: "Não foi possível validar a sua conta Google. Tente novamente.",
    });
  });
});

describe("HttpUserDataSource", () => {
  it("lê e atualiza /users/me; senha atual errada vira erro no campo", async () => {
    const usuario = { id: "up1", name: "Alessandro", email: "a@mail.com", phone: "11991234567", createdAt: "2024-01-15T10:00:00Z" };
    fetchMock.mockResolvedValueOnce(resposta({ usuario })).mockResolvedValueOnce(resposta({ usuario: { ...usuario, name: "Alê" } }));
    const fonte = new HttpUserDataSource(new HttpClient(new MemoryAuthSessionService(), "http://api.teste/api/v1"));
    expect((await fonte.getCurrentUser()).name).toBe("Alessandro");
    expect((await fonte.updateProfile({ name: "Alê", phone: "11991234567" })).name).toBe("Alê");
    expect(fetchMock.mock.calls[1]![1].method).toBe("PATCH");

    fetchMock.mockResolvedValueOnce(resposta({ error: "INVALID_CURRENT_PASSWORD", message: "Senha atual incorreta." }, 401));
    const erro = await fonte.changePassword("errada", "novaSenha1").catch((e: unknown) => e);
    expect((erro as ValidationError).fields).toEqual({ currentPassword: "Senha atual incorreta." });
  });
});
