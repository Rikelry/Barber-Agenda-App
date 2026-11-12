/** Erro com mensagem pronta para a tela e um código estável para decidir o que fazer. */
export class DomainError extends Error {
  constructor(
    message: string,
    readonly code: DomainErrorCode,
  ) {
    super(message);
    this.name = "DomainError";
  }
}

export type DomainErrorCode =
  | "UNAUTHORIZED"
  | "NOT_FOUND"
  | "NETWORK"
  | "SERVER"
  | "INVALID_DATA";
