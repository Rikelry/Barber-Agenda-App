/** Acesso à API do Barber Agenda. Erros chegam como DomainError (ou ValidationError por campo). */
export interface IApiService {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body?: unknown): Promise<T>;
  patch<T>(path: string, body?: unknown): Promise<T>;
}
