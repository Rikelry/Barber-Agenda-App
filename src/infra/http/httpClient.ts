// Cliente HTTP da API Express (backend/). Envia o token da sessão e traduz erros técnicos
// (rede, 401, 404, 5xx, JSON inválido) em DomainError com mensagem pronta para a tela.

import { DomainError } from "@/model/errors";
import type { IApiService } from "@/model/services/iApiService";
import type { IAuthSessionService } from "@/model/services/iAuthSessionService";

/** Base da API. Configure EXPO_PUBLIC_API_URL no .env (no celular, use o IP da máquina). */
export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/api/v1").replace(
  /\/+$/,
  "",
);

const TIMEOUT_MS = 15000;

const messageFrom = (body: unknown): string | null => {
  if (typeof body === "object" && body !== null && "message" in body) {
    const { message } = body as { message: unknown };
    if (typeof message === "string" && message.trim()) return message;
  }
  return null;
};

export class HttpClient implements IApiService {
  constructor(
    private readonly session: IAuthSessionService,
    private readonly baseUrl: string = API_BASE_URL,
  ) {}

  async get<T>(path: string): Promise<T> {
    const headers: Record<string, string> = { Accept: "application/json" };
    const token = this.session.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, {
        headers,
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

    if (response.status === 401) {
      throw new DomainError("Entre na sua conta para ver as barbearias.", "UNAUTHORIZED");
    }
    if (response.status === 404) {
      throw new DomainError(messageFrom(body) ?? "Não encontramos o que você procurou.", "NOT_FOUND");
    }
    if (!response.ok) {
      throw new DomainError("O servidor teve um problema. Tente de novo em instantes.", "SERVER");
    }
    if (body === null) {
      throw new DomainError("O servidor respondeu num formato inesperado.", "INVALID_DATA");
    }
    return body as T;
  }
}
