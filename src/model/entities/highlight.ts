/** Categorias do acesso rápido da Home (padrão 9 de 05-padroes.md: Cabelo, Barba, Combo...). */
export type ServiceCategory = "cabelo" | "barba" | "combo" | "sobrancelha";

/** Barbearia em destaque na Home. */
export type BarbershopHighlight = {
  id: string;
  name: string;
  neighborhood: string;
  /** Nota média de 0 a 5. */
  rating: number;
  imageUrl: string | null;
  categories: ServiceCategory[];
};
