/** Leitura de dados da API do Barber Agenda. Erros chegam como DomainError. */
export interface IApiService {
  get<T>(path: string): Promise<T>;
}
