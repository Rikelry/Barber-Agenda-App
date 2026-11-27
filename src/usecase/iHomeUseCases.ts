import type { BarbershopHighlight, ServiceCategory } from "@/model/entities/highlight";

export interface IHomeUseCases {
  /** Todas as barbearias com categorias e "aberta agora": abertas primeiro, depois nota e nome. */
  getHighlights(now?: Date): Promise<BarbershopHighlight[]>;
  /**
   * As barbearias da categoria escolhida (todas quando a categoria é null) que batem com a
   * pesquisa por nome ou endereço (ignora maiúsculas e acentos). O Início é a lista completa.
   */
  filterHighlights(
    highlights: BarbershopHighlight[],
    category: ServiceCategory | null,
    search?: string,
  ): BarbershopHighlight[];
}
