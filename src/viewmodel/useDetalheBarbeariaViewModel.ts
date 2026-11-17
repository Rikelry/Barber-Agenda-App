import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { barbershopUseCases } from "@/di/container";
import type { Professional } from "@/model/entities/professional";
import { DomainError } from "@/model/errors";
import type { BarbershopDetail, IBarbershopUseCases } from "@/usecase/iBarbershopUseCases";

export type DetalheBarbeariaStatus = "loading" | "error" | "content";
export type DetalheBarbeariaAba = "servicos" | "profissionais";

export type DetalheBarbeariaState = {
  status: DetalheBarbeariaStatus;
  detail: BarbershopDetail | null;
  tab: DetalheBarbeariaAba;
  errorMessage: string | null;
};

export type DetalheBarbeariaActions = {
  setTab: (tab: DetalheBarbeariaAba) => void;
  retry: () => void;
  goBack: () => void;
  openBarber: (professional: Professional) => void;
  /** Abre o novo agendamento com o serviço escolhido. */
  book: (serviceId: string) => void;
};

export function useDetalheBarbeariaViewModel(
  useCases: IBarbershopUseCases = barbershopUseCases,
): [DetalheBarbeariaState, DetalheBarbeariaActions] {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [status, setStatus] = useState<DetalheBarbeariaStatus>("loading");
  const [detail, setDetail] = useState<BarbershopDetail | null>(null);
  const [tab, setTab] = useState<DetalheBarbeariaAba>("servicos");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
    { status, detail, tab, errorMessage },
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
    },
  ];
}
