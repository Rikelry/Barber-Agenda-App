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
  | "INVALID_DATA"
  | "VALIDATION";

/** Campos inválidos de um formulário, cada um com a mensagem que aparece abaixo dele. */
export class ValidationError<Campo extends string = string> extends DomainError {
  constructor(readonly fields: Partial<Record<Campo, string>>) {
    super("Confira os campos destacados.", "VALIDATION");
    this.name = "ValidationError";
  }
}
