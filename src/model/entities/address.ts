/** Endereço em partes. A API guarda um texto só; o use case monta e separa. */
export type Address = {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
};
