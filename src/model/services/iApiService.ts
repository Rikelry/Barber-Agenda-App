/** Acesso à API do Barber Agenda. Erros chegam como DomainError (ou ValidationError por campo). */
export interface IApiService {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body?: unknown): Promise<T>;
  patch<T>(path: string, body?: unknown): Promise<T>;
  delete<T>(path: string): Promise<T>;
  /** Envia um arquivo do aparelho (multipart/form-data) com campos extras. */
  upload<T>(path: string, file: LocalFile, fields?: Record<string, string>): Promise<T>;
}

/** Arquivo escolhido no aparelho (ex.: foto da galeria). */
export type LocalFile = { uri: string; name: string; mimeType: string };
