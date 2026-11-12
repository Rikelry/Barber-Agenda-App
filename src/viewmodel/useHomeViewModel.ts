import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { homeUseCases, profileUseCases } from "@/di/container";
import type { Appointment } from "@/model/entities/appointment";
import type { BarbershopHighlight, ServiceCategory } from "@/model/entities/highlight";
import type { User } from "@/model/entities/user";
import { DomainError } from "@/model/errors";
import type { IHomeUseCases } from "@/usecase/iHomeUseCases";
import type { IProfileUseCases } from "@/usecase/iProfileUseCases";

export type HomeStatus = "loading" | "error" | "content";

export type HomeState = {
  status: HomeStatus;
  user: User | null;
  category: ServiceCategory | null;
  highlights: BarbershopHighlight[];
  loadingHighlights: boolean;
  nextAppointment: Appointment | null;
  errorMessage: string | null;
};

export type HomeActions = {
  selectCategory: (category: ServiceCategory) => void;
  retry: () => void;
  openSearch: () => void;
  openHighlight: (barbershopId: string) => void;
  goProfile: () => void;
};

const mensagem = (erro: unknown) =>
  erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.";

export function useHomeViewModel(
  home: IHomeUseCases = homeUseCases,
  profile: IProfileUseCases = profileUseCases,
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
      Promise.all([profile.getProfile(), home.getHighlights(categoria), home.getNextAppointment()]).then(
        ([usuario, destaques, proximo]) => {
          setUser(usuario);
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
    },
    [home, profile],
  );

  useEffect(() => {
    carregar("cabelo");
  }, [carregar]);

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
    { status, user, category, highlights, loadingHighlights, nextAppointment, errorMessage },
    {
      selectCategory,
      retry: () => {
        setStatus("loading");
        carregar(category);
      },
      openSearch: () => router.navigate("/barbeiros"),
      openHighlight: (barbershopId) =>
        router.push({ pathname: "/barbearia/[id]", params: { id: barbershopId } }),
      goProfile: () => router.navigate("/perfil"),
    },
  ];
}
