import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";

import { portfolioUseCases } from "@/di/container";
import type { PortfolioPhoto } from "@/model/entities/portfolioPhoto";
import { DomainError } from "@/model/errors";
import type { IPortfolioUseCases } from "@/usecase/iPortfolioUseCases";

export type InspiracoesStatus = "loading" | "error" | "empty" | "content";

export type InspiracoesState = {
  status: InspiracoesStatus;
  /** "Inspirações" (todas) ou "Trabalhos da equipe" (de uma barbearia). */
  title: string;
  photos: PortfolioPhoto[];
  errorMessage: string | null;
};

export type InspiracoesActions = {
  retry: () => void;
  open: (photo: PortfolioPhoto) => void;
  goBack: () => void;
};

/**
 * "Ver todas" das Inspirações do Início (fotos marcadas pelos profissionais) e "Ver todos" dos
 * trabalhos da equipe no detalhe da barbearia (rota com barbershopId).
 */
export function useInspiracoesViewModel(
  useCases: IPortfolioUseCases = portfolioUseCases,
): [InspiracoesState, InspiracoesActions] {
  const { barbershopId } = useLocalSearchParams<{ barbershopId?: string }>();
  const [status, setStatus] = useState<InspiracoesStatus>("loading");
  const [photos, setPhotos] = useState<PortfolioPhoto[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const carregar = useCallback(() => {
    (barbershopId ? useCases.listByBarbershop(barbershopId) : useCases.listInspirations()).then(
      (lista) => {
        setPhotos(lista);
        setErrorMessage(null);
        setStatus(lista.length === 0 ? "empty" : "content");
      },
      (erro: unknown) => {
        setErrorMessage(erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.");
        setStatus("error");
      },
    );
  }, [useCases, barbershopId]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  return [
    { status, title: barbershopId ? "Trabalhos da equipe" : "Inspirações", photos, errorMessage },
    {
      retry: () => {
        setStatus("loading");
        carregar();
      },
      open: (foto) =>
        router.push({ pathname: "/portfolio/[id]", params: { id: foto.id, professionalId: foto.professionalId } }),
      goBack: () => (router.canGoBack() ? router.back() : router.replace("/")),
    },
  ];
}
