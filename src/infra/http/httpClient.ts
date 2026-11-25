// Cliente HTTP da API Express (src/infra/http/). Envia o token da sessão e traduz erros técnicos
// (rede, 400 de validação, 401, 404, 409, 429, 5xx, JSON inválido) em DomainError com
// mensagem pronta para a tela.

import { DomainError, ValidationError } from "@/model/errors";
import type { IApiService, LocalFile } from "@/model/services/iApiService";
import type { IAuthSessionService } from "@/model/services/iAuthSessionService";

/** Base da API. Configure EXPO_PUBLIC_API_URL no .env (no celular, use o IP da máquina). */
export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/api/v1").replace(
  /\/+$/,
  "",
);

const TIMEOUT_MS = 15000;

type ErrorBody = { error?: unknown; message?: unknown; details?: unknown };

const asErrorBody = (body: unknown): ErrorBody =>
  typeof body === "object" && body !== null ? (body as ErrorBody) : {};

const messageFrom = (body: unknown): string | null => {
  const { message } = asErrorBody(body);
  return typeof message === "string" && message.trim() ? message : null;
};

/** details do middleware validate do backend: { campo: ["mensagem", ...] }. */
const fieldsFrom = (body: unknown): Record<string, string> => {
  const { details } = asErrorBody(body);
  if (typeof details !== "object" || details === null) return {};
  const fields: Record<string, string> = {};
  for (const [campo, mensagens] of Object.entries(details as Record<string, unknown>)) {
    if (Array.isArray(mensagens) && typeof mensagens[0] === "string") fields[campo] = mensagens[0];
  }
  return fields;
};

export class HttpClient implements IApiService {
  constructor(
    private readonly session: IAuthSessionService,
    private readonly baseUrl: string = API_BASE_URL,
  ) {}

  get<T>(path: string): Promise<T> {
    return this.request<T>("GET", path);
  }

  post<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("POST", path, body);
  }

  patch<T>(path: string, body?: unknown): Promise<T> {
    return this.request<T>("PATCH", path, body);
  }

  delete<T>(path: string): Promise<T> {
    return this.request<T>("DELETE", path);
  }

  async upload<T>(path: string, file: LocalFile, fields: Record<string, string> = {}): Promise<T> {
    const form = new FormData();
    for (const [chave, valor] of Object.entries(fields)) form.append(chave, valor);
    if (file.uri.startsWith("blob:") || file.uri.startsWith("data:")) {
      // Web: o seletor devolve um blob; o fetch precisa do arquivo em si.
      const blob = await (await fetch(file.uri)).blob();
      form.append("file", blob, file.name);
    } else {
      // Android/iOS: o React Native lê o arquivo a partir da uri.
      form.append("file", { uri: file.uri, name: file.name, type: file.mimeType } as unknown as Blob);
    }
    return this.request<T>("POST", path, form);
  }

  private async request<T>(method: string, path: string, payload?: unknown): Promise<T> {
    const headers: Record<string, string> = { Accept: "application/json" };
    const multipart = payload instanceof FormData;
    // Com FormData o fetch define o Content-Type com o boundary sozinho.
    if (payload !== undefined && !multipart) headers["Content-Type"] = "application/json";
    const token = this.session.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers,
        ...(payload !== undefined && { body: multipart ? payload : JSON.stringify(payload) }),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch {
      throw new DomainError("Sem conexão com o servidor. Verifique a internet e tente de novo.", "NETWORK");
    }

    let body: unknown = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }

    if (response.ok) {
      // 204 (sem corpo) é sucesso em rotas que não devolvem dados.
      if (body === null && response.status !== 204) {
        throw new DomainError("O servidor respondeu num formato inesperado.", "INVALID_DATA");
      }
      return body as T;
    }

    const { error } = asErrorBody(body);
    if (response.status === 400 && error === "VALIDATION_ERROR") {
      throw new ValidationError(fieldsFrom(body));
    }
    if (response.status === 401 && error === "INVALID_CURRENT_PASSWORD") {
      throw new ValidationError({ currentPassword: messageFrom(body) ?? "Senha atual incorreta." });
    }
    if (response.status === 401) {
      throw new DomainError(
        error === "INVALID_CREDENTIALS" ? (messageFrom(body) ?? "E-mail ou senha inválidos.") : "Entre na sua conta para continuar.",
        "UNAUTHORIZED",
      );
    }
    if (response.status === 403) {
      throw new DomainError(messageFrom(body) ?? "Você não tem permissão para fazer isso.", "UNAUTHORIZED");
    }
    if (response.status === 404) {
      throw new DomainError(messageFrom(body) ?? "Não encontramos o que você procurou.", "NOT_FOUND");
    }
    if (response.status === 409 && error === "EMAIL_ALREADY_EXISTS") {
      throw new ValidationError({ email: messageFrom(body) ?? "E-mail já cadastrado." });
    }
    if (response.status === 400 || response.status === 409 || response.status === 429) {
      throw new DomainError(messageFrom(body) ?? "Não foi possível concluir. Confira os dados.", "INVALID_DATA");
    }
    throw new DomainError("O servidor teve um problema. Tente de novo em instantes.", "SERVER");
  }
}
