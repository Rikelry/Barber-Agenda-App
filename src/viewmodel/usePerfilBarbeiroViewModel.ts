import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { barbershopUseCases, portfolioUseCases } from "@/di/container";
import type { PortfolioPhoto } from "@/model/entities/portfolioPhoto";
import { DomainError } from "@/model/errors";
import type { BarberProfile, IBarbershopUseCases } from "@/usecase/iBarbershopUseCases";
import type { IPortfolioUseCases } from "@/usecase/iPortfolioUseCases";

export type PerfilBarbeiroStatus = "loading" | "error" | "content";

export type PerfilBarbeiroState = {
  status: PerfilBarbeiroStatus;
  profile: BarberProfile | null;
  /** Fotos do portfólio do barbeiro (vazio se não houver ou se falhar). */
  photos: PortfolioPhoto[];
  errorMessage: string | null;
};

export type PerfilBarbeiroActions = {
  retry: () => void;
  openBarbershop: () => void;
  openPhoto: (photoId: string) => void;
  goBack: () => void;
};

export function usePerfilBarbeiroViewModel(
  useCases: IBarbershopUseCases = barbershopUseCases,
  portfolio: IPortfolioUseCases = portfolioUseCases,
): [PerfilBarbeiroState, PerfilBarbeiroActions] {
  const { id, barbershopId } = useLocalSearchParams<{ id: string; barbershopId: string }>();
  const [status, setStatus] = useState<PerfilBarbeiroStatus>("loading");
  const [profile, setProfile] = useState<BarberProfile | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [photos, setPhotos] = useState<PortfolioPhoto[]>([]);
  const pedido = useRef(0);

  useEffect(() => {
    // O portfólio é um extra: se falhar, a tela continua sem ele.
    if (id) portfolio.listByProfessional(id).then(setPhotos, () => setPhotos([]));
  }, [id, portfolio]);

  const carregar = useCallback(() => {
    const atual = ++pedido.current;
    if (!barbershopId) return;
    useCases.getBarberProfile(barbershopId, id).then(
      (dados) => {
        if (atual !== pedido.current) return;
        setProfile(dados);
        setErrorMessage(null);
        setStatus("content");
      },
      (erro: unknown) => {
        if (atual !== pedido.current) return;
        setErrorMessage(erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.");
        setStatus("error");
      },
    );
  }, [id, barbershopId, useCases]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Link sem a barbearia: não há o que buscar.
  const semBarbearia = !barbershopId;

  return [
    semBarbearia
      ? { status: "error", profile: null, photos: [], errorMessage: "Não sabemos em qual barbearia este barbeiro trabalha." }
      : { status, profile, photos, errorMessage },
    {
      retry: () => {
        if (semBarbearia) return;
        setStatus("loading");
        carregar();
      },
      openBarbershop: () => {
        if (barbershopId) router.push({ pathname: "/barbearia/[id]", params: { id: barbershopId } });
      },
      openPhoto: (photoId) => router.push({ pathname: "/portfolio/[id]", params: { id: photoId, professionalId: id } }),
      goBack: () => (router.canGoBack() ? router.back() : router.replace("/barbearias")),
    },
  ];
}
