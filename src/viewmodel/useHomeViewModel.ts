import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { authUseCases, homeUseCases, portfolioUseCases } from "@/di/container";
import type { PortfolioPhoto } from "@/model/entities/portfolioPhoto";
import type { Appointment } from "@/model/entities/appointment";
import type { BarbershopHighlight, ServiceCategory } from "@/model/entities/highlight";
import type { User } from "@/model/entities/user";
import { DomainError } from "@/model/errors";
import type { IHomeUseCases } from "@/usecase/iHomeUseCases";
import type { IAuthUseCases } from "@/usecase/iAuthUseCases";
import type { IPortfolioUseCases } from "@/usecase/iPortfolioUseCases";

export type HomeStatus = "loading" | "error" | "content";

export type HomeState = {
  status: HomeStatus;
  user: User | null;
  category: ServiceCategory | null;
  highlights: BarbershopHighlight[];
  loadingHighlights: boolean;
  nextAppointment: Appointment | null;
  /** Fotos dos profissionais marcadas para as Inspirações (vazio se falhar). */
  inspirations: PortfolioPhoto[];
  errorMessage: string | null;
};

export type HomeActions = {
  selectCategory: (category: ServiceCategory) => void;
  retry: () => void;
  openSearch: () => void;
  openHighlight: (barbershopId: string) => void;
  goProfile: () => void;
  /** Toque no card do próximo agendamento: abre a aba Agendas. */
  openAppointments: () => void;
  openInspiration: (photo: PortfolioPhoto) => void;
};

const mensagem = (erro: unknown) =>
  erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.";

export function useHomeViewModel(
  home: IHomeUseCases = homeUseCases,
  auth: IAuthUseCases = authUseCases,
  portfolio: IPortfolioUseCases = portfolioUseCases,
): [HomeState, HomeActions] {
  const [status, setStatus] = useState<HomeStatus>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [category, setCategory] = useState<ServiceCategory | null>("cabelo");
  const [highlights, setHighlights] = useState<BarbershopHighlight[]>([]);
  const [loadingHighlights, setLoadingHighlights] = useState(false);
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const carregar = useCallback(
    (categoria: ServiceCategory | null) => {
      auth.restoreSession().then((sessao) => {
        // Padrão 1 de 05-padroes.md: sem conta entrada, o app abre no login.
        if (!sessao) {
          router.replace("/login");
          return;
        }
        setUser(sessao.user);
        Promise.all([home.getHighlights(categoria), home.getNextAppointment()]).then(
          ([destaques, proximo]) => {
            setHighlights(destaques);
            setNextAppointment(proximo);
            setErrorMessage(null);
            setStatus("content");
          },
          (erro: unknown) => {
            setErrorMessage(mensagem(erro));
            setStatus("error");
          },
        );
      });
    },
    [home, auth],
  );

  const [inspirations, setInspirations] = useState<PortfolioPhoto[]>([]);

  useEffect(() => {
    carregar("cabelo");
  }, [carregar]);

  // As Inspirações são um extra: sem sessão ou com erro, a seção só não aparece. Recarrega
  // ao voltar para a aba, para mostrar fotos publicadas enquanto o Início estava aberto.
  useFocusEffect(
    useCallback(() => {
      portfolio.listInspirations().then(setInspirations, () => setInspirations([]));
    }, [portfolio]),
  );

  const selectCategory = (escolhida: ServiceCategory) => {
    // Tocar na categoria já escolhida mostra todas de novo.
    const nova = escolhida === category ? null : escolhida;
    setCategory(nova);
    setLoadingHighlights(true);
    home
      .getHighlights(nova)
      .then(setHighlights, (erro: unknown) => setErrorMessage(mensagem(erro)))
      .finally(() => setLoadingHighlights(false));
  };

  return [
    { status, user, category, highlights, loadingHighlights, nextAppointment, inspirations, errorMessage },
    {
      selectCategory,
      retry: () => {
        setStatus("loading");
        carregar(category);
      },
      openSearch: () => router.navigate("/barbearias"),
      openHighlight: (barbershopId) =>
        router.push({ pathname: "/barbearia/[id]", params: { id: barbershopId } }),
      goProfile: () => router.navigate("/perfil"),
      openAppointments: () => router.navigate("/agendamentos"),
      openInspiration: (foto) =>
        router.push({ pathname: "/portfolio/[id]", params: { id: foto.id, professionalId: foto.professionalId } }),
    },
  ];
}
