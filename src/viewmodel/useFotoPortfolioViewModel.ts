import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { portfolioUseCases } from "@/di/container";
import type { PortfolioPhoto } from "@/model/entities/portfolioPhoto";
import { DomainError } from "@/model/errors";
import type { IPortfolioUseCases } from "@/usecase/iPortfolioUseCases";

export type FotoPortfolioStatus = "loading" | "error" | "content";

export type FotoPortfolioState = {
  status: FotoPortfolioStatus;
  photo: PortfolioPhoto | null;
  /** Aberta do "Meu portfólio": mostra Excluir em vez de "Quero este corte". */
  mine: boolean;
  confirmingRemove: boolean;
  removing: boolean;
  errorMessage: string | null;
};

export type FotoPortfolioActions = {
  retry: () => void;
  /** Agenda o serviço da foto com o mesmo profissional; sem serviço, abre a barbearia. */
  wantThisCut: () => void;
  askRemove: () => void;
  dismissRemove: () => void;
  confirmRemove: () => void;
  goBack: () => void;
};

const mensagem = (erro: unknown) => (erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.");

export function useFotoPortfolioViewModel(
  useCases: IPortfolioUseCases = portfolioUseCases,
): [FotoPortfolioState, FotoPortfolioActions] {
  const params = useLocalSearchParams<{ id: string; professionalId: string; mine?: string }>();
  const [status, setStatus] = useState<FotoPortfolioStatus>("loading");
  const [photo, setPhoto] = useState<PortfolioPhoto | null>(null);
  const [confirmingRemove, setConfirmingRemove] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const carregar = useCallback(() => {
    useCases.getPhoto(params.professionalId, params.id).then(
      (foto) => {
        setPhoto(foto);
        setErrorMessage(null);
        setStatus("content");
      },
      (erro: unknown) => {
        setErrorMessage(mensagem(erro));
        setStatus("error");
      },
    );
  }, [params.id, params.professionalId, useCases]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const voltar = () => (router.canGoBack() ? router.back() : router.replace("/"));

  return [
    { status, photo, mine: params.mine === "1", confirmingRemove, removing, errorMessage },
    {
      retry: () => {
        setStatus("loading");
        carregar();
      },
      wantThisCut: () => {
        if (!photo) return;
        if (photo.serviceId) {
          router.push({
            pathname: "/agendamento/novo",
            params: { barbershopId: photo.barbershopId, serviceId: photo.serviceId, professionalId: photo.professionalId },
          });
        } else {
          router.push({ pathname: "/barbearia/[id]", params: { id: photo.barbershopId } });
        }
      },
      askRemove: () => setConfirmingRemove(true),
      dismissRemove: () => setConfirmingRemove(false),
      confirmRemove: () => {
        if (!photo || removing) return;
        setRemoving(true);
        useCases
          .remove(photo.id)
          .then(voltar, (erro: unknown) => setErrorMessage(mensagem(erro)))
          .finally(() => {
            setRemoving(false);
            setConfirmingRemove(false);
          });
      },
      goBack: voltar,
    },
  ];
}
