import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { portfolioUseCases } from "@/di/container";
import type { PortfolioPhoto } from "@/model/entities/portfolioPhoto";
import { DomainError } from "@/model/errors";
import type { IPortfolioUseCases } from "@/usecase/iPortfolioUseCases";

export type MeuPortfolioStatus = "loading" | "error" | "content";

export type MeuPortfolioState = {
  status: MeuPortfolioStatus;
  photos: PortfolioPhoto[];
  errorMessage: string | null;
};

export type MeuPortfolioActions = {
  retry: () => void;
  add: () => void;
  open: (photo: PortfolioPhoto) => void;
  goBack: () => void;
};

export function useMeuPortfolioViewModel(
  useCases: IPortfolioUseCases = portfolioUseCases,
): [MeuPortfolioState, MeuPortfolioActions] {
  const [status, setStatus] = useState<MeuPortfolioStatus>("loading");
  const [photos, setPhotos] = useState<PortfolioPhoto[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const carregar = useCallback(() => {
    useCases.listMine().then(
      (lista) => {
        setPhotos(lista);
        setErrorMessage(null);
        setStatus("content");
      },
      (erro: unknown) => {
        setErrorMessage(erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.");
        setStatus("error");
      },
    );
  }, [useCases]);

  // Recarrega ao voltar de "Nova foto" ou de uma foto excluída.
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  return [
    { status, photos, errorMessage },
    {
      retry: () => {
        setStatus("loading");
        carregar();
      },
      add: () => router.push("/portfolio/nova"),
      open: (foto) =>
        router.push({ pathname: "/portfolio/[id]", params: { id: foto.id, professionalId: foto.professionalId, mine: "1" } }),
      goBack: () => (router.canGoBack() ? router.back() : router.replace("/perfil")),
    },
  ];
}
