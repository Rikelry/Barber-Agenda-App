import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
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
  /** Profissional escolhido na aba Profissionais; o Agendar já abre com ele. */
  selectedProfessional: Professional | null;
  errorMessage: string | null;
};

export type DetalheBarbeariaActions = {
  setTab: (tab: DetalheBarbeariaAba) => void;
  retry: () => void;
  goBack: () => void;
  openBarber: (professional: Professional) => void;
  /** Escolhe o profissional e volta para os serviços, para agendar com ele. */
  selectProfessional: (professional: Professional) => void;
  clearProfessional: () => void;
  /** Abre o novo agendamento com o serviço (e o profissional, se escolhido). */
  book: (serviceId: string) => void;
  openPhoto: (photo: PortfolioPhoto) => void;
  /** "Ver todos" dos trabalhos da equipe. */
  openAllPhotos: () => void;
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
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);

  useEffect(() => {
    // Sem fotos (ou se falhar), a seção mostra o estado vazio.
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

  // A foto ocupa o topo, atrás da barra de status: ícones claros enquanto a tela está aberta.
  useFocusEffect(
    useCallback(() => {
      setStatusBarStyle("light");
      return () => setStatusBarStyle("auto");
    }, []),
  );

  return [
    { status, detail, tab, photos, selectedProfessional, errorMessage },
    {
      setTab,
      retry: () => {
        setStatus("loading");
        carregar();
      },
      goBack: () => (router.canGoBack() ? router.back() : router.replace("/")),
      openBarber: (professional) =>
        router.push({
          pathname: "/barbeiro/[id]",
          params: { id: professional.id, barbershopId: professional.barbershopId },
        }),
      selectProfessional: (professional) => {
        setSelectedProfessional(professional);
        setTab("servicos");
      },
      clearProfessional: () => setSelectedProfessional(null),
      book: (serviceId) =>
        router.push({
          pathname: "/agendamento/novo",
          params: {
            barbershopId: id,
            serviceId,
            ...(selectedProfessional && { professionalId: selectedProfessional.id }),
          },
        }),
      openPhoto: (foto) =>
        router.push({ pathname: "/portfolio/[id]", params: { id: foto.id, professionalId: foto.professionalId } }),
      openAllPhotos: () => router.push({ pathname: "/inspiracoes", params: { barbershopId: id } }),
    },
  ];
}
