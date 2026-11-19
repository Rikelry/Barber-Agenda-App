import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { barbershopUseCases, portfolioUseCases } from "@/di/container";
import type { PortfolioPhoto } from "@/model/entities/portfolioPhoto";
import type { Professional } from "@/model/entities/professional";
import { DomainError } from "@/model/errors";
import type { BarbershopDetail, IBarbershopUseCases } from "@/usecase/iBarbershopUseCases";
import type { IPortfolioUseCases } from "@/usecase/iPortfolioUseCases";

export type DetalheBarbeariaStatus = "loading" | "error" | "content";
export type DetalheBarbeariaAba = "servicos" | "profissionais";

export type DetalheBarbeariaState = {
  status: DetalheBarbeariaStatus;
  detail: BarbershopDetail | null;
  tab: DetalheBarbeariaAba;
  /** Trabalhos da equipe (portfólio dos profissionais da barbearia). */
  photos: PortfolioPhoto[];
  errorMessage: string | null;
};

export type DetalheBarbeariaActions = {
  setTab: (tab: DetalheBarbeariaAba) => void;
  retry: () => void;
  goBack: () => void;
  openBarber: (professional: Professional) => void;
  /** Abre o novo agendamento com o serviço escolhido. */
  book: (serviceId: string) => void;
  openPhoto: (photo: PortfolioPhoto) => void;
};

export function useDetalheBarbeariaViewModel(
  useCases: IBarbershopUseCases = barbershopUseCases,
  portfolio: IPortfolioUseCases = portfolioUseCases,
): [DetalheBarbeariaState, DetalheBarbeariaActions] {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [status, setStatus] = useState<DetalheBarbeariaStatus>("loading");
  const [detail, setDetail] = useState<BarbershopDetail | null>(null);
  const [tab, setTab] = useState<DetalheBarbeariaAba>("servicos");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [photos, setPhotos] = useState<PortfolioPhoto[]>([]);

  useEffect(() => {
    // Sem fotos (ou se falhar), a barbearia só não mostra a seção.
    if (id) portfolio.listByBarbershop(id).then(setPhotos, () => setPhotos([]));
  }, [id, portfolio]);
  const pedido = useRef(0);

  const carregar = useCallback(() => {
    const atual = ++pedido.current;
    useCases.getBarbershopDetail(id).then(
      (dados) => {
        if (atual !== pedido.current) return;
        setDetail(dados);
        setErrorMessage(null);
        setStatus("content");
      },
      (erro: unknown) => {
        if (atual !== pedido.current) return;
        setErrorMessage(erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.");
        setStatus("error");
      },
    );
  }, [id, useCases]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return [
    { status, detail, tab, photos, errorMessage },
    {
      setTab,
      retry: () => {
        setStatus("loading");
        carregar();
      },
      goBack: () => (router.canGoBack() ? router.back() : router.replace("/barbearias")),
      openBarber: (professional) =>
        router.push({
          pathname: "/barbeiro/[id]",
          params: { id: professional.id, barbershopId: professional.barbershopId },
        }),
      book: (serviceId) =>
        router.push({ pathname: "/agendamento/novo", params: { barbershopId: id, serviceId } }),
      openPhoto: (foto) =>
        router.push({ pathname: "/portfolio/[id]", params: { id: foto.id, professionalId: foto.professionalId } }),
    },
  ];
}
