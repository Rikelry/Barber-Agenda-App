/** Categorias do acesso rápido da Home (padrão 9 de 05-padroes.md: Cabelo, Barba, Combo...). */
export type ServiceCategory = "cabelo" | "barba" | "combo" | "sobrancelha";

/**
 * Barbearia em destaque na Home, montada com os dados reais da API. Nota, avaliações e distância
 * ficam null enquanto a API não tiver esses dados; a tela só mostra o que existe.
 */
export type BarbershopHighlight = {
  id: string;
  name: string;
  /** Endereço cadastrado (a API ainda não separa o bairro). */
  location: string;
  /** Nota média de 0 a 5. */
  rating: number | null;
  reviewCount: number | null;
  distanceKm: number | null;
  imageUrl: string | null;
  /** Categorias deduzidas dos serviços cadastrados. */
  categories: ServiceCategory[];
  /** Aberta agora pelos horários cadastrados; null quando não há horário cadastrado. */
  isOpen: boolean | null;
};
