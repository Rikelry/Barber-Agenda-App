import { router, useFocusEffect } from "expo-router";
import { setStatusBarStyle } from "expo-status-bar";
import { useCallback, useMemo, useRef, useState } from "react";

import { appointmentUseCases, authUseCases, homeUseCases, portfolioUseCases } from "@/di/container";
import type { Appointment } from "@/model/entities/appointment";
import type { BarbershopHighlight, ServiceCategory } from "@/model/entities/highlight";
import type { PortfolioPhoto } from "@/model/entities/portfolioPhoto";
import type { User } from "@/model/entities/user";
import { DomainError } from "@/model/errors";
import type { IAppointmentUseCases } from "@/usecase/iAppointmentUseCases";
import type { IAuthUseCases } from "@/usecase/iAuthUseCases";
import type { IHomeUseCases } from "@/usecase/iHomeUseCases";
import type { IPortfolioUseCases } from "@/usecase/iPortfolioUseCases";

export type HomeStatus = "loading" | "error" | "content";

export type HomeState = {
  status: HomeStatus;
  user: User | null;
  /** Categoria escolhida; null mostra todas. */
  category: ServiceCategory | null;
  /** Texto da pesquisa do cabeçalho (nome ou endereço da barbearia). */
  search: string;
  /** Barbearias em destaque já filtradas pela categoria. */
  highlights: BarbershopHighlight[];
  nextAppointment: Appointment | null;
  /** Foto da barbearia do próximo agendamento, quando ela tem uma. */
  nextAppointmentImageUrl: string | null;
  /** Fotos dos profissionais marcadas para as Inspirações (vazio se falhar). */
  inspirations: PortfolioPhoto[];
  errorMessage: string | null;
};

export type HomeActions = {
  /** Uma categoria por vez; null ("Tudo") remove o filtro. */
  selectCategory: (category: ServiceCategory | null) => void;
  setSearch: (text: string) => void;
  retry: () => void;
  goProfile: () => void;
  openHighlight: (barbershopId: string) => void;
  /** Toque no card do próximo agendamento ou em "Ver detalhes": abre a aba Agendas. */
  openAppointments: () => void;
  openInspiration: (photo: PortfolioPhoto) => void;
  openAllInspirations: () => void;
};

const mensagem = (erro: unknown) =>
  erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.";

export function useHomeViewModel(
  home: IHomeUseCases = homeUseCases,
  auth: IAuthUseCases = authUseCases,
  portfolio: IPortfolioUseCases = portfolioUseCases,
  appointments: IAppointmentUseCases = appointmentUseCases,
): [HomeState, HomeActions] {
  const [status, setStatus] = useState<HomeStatus>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [search, setSearch] = useState("");
  const [allHighlights, setAllHighlights] = useState<BarbershopHighlight[]>([]);
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [inspirations, setInspirations] = useState<PortfolioPhoto[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const carregou = useRef(false);

  const carregar = useCallback(() => {
    auth.restoreSession().then((sessao) => {
      // Padrão 1 de 05-padroes.md: sem conta entrada, o app abre no login.
      if (!sessao) {
        router.replace("/login");
        return;
      }
      setUser(sessao.user);
      Promise.all([home.getHighlights(), appointments.getNextAppointment()]).then(
        ([destaques, proximo]) => {
          carregou.current = true;
          setAllHighlights(destaques);
          setNextAppointment(proximo);
          setErrorMessage(null);
          setStatus("content");
        },
        (erro: unknown) => {
          // Numa recarga ao voltar para a aba, mantém o que já estava na tela.
          if (carregou.current) return;
          setErrorMessage(mensagem(erro));
          setStatus("error");
        },
      );
      // As Inspirações são um extra: com erro, a seção só não aparece.
      portfolio.listInspirations().then(setInspirations, () => setInspirations([]));
    });
  }, [home, auth, portfolio, appointments]);

  // Recarrega ao voltar para a aba: um agendamento novo ou cancelado aparece sem puxar a tela.
  // O cabeçalho é marrom escuro: ícones claros na barra de status só enquanto o Início está aberto.
  useFocusEffect(
    useCallback(() => {
      carregar();
      setStatusBarStyle("light");
      return () => setStatusBarStyle("auto");
    }, [carregar]),
  );

  const highlights = useMemo(
    () => home.filterHighlights(allHighlights, category, search),
    [home, allHighlights, category, search],
  );
  const nextAppointmentImageUrl =
    allHighlights.find((h) => h.id === nextAppointment?.barbershopId)?.imageUrl ?? null;

  return [
    {
      status,
      user,
      category,
      search,
      highlights,
      nextAppointment,
      nextAppointmentImageUrl,
      inspirations,
      errorMessage,
    },
    {
      selectCategory: (escolhida) => setCategory(escolhida),
      setSearch,
      retry: () => {
        setStatus("loading");
        carregar();
      },
      goProfile: () => router.navigate("/perfil"),
      openHighlight: (barbershopId) =>
        router.push({ pathname: "/barbearia/[id]", params: { id: barbershopId } }),
      openAppointments: () => router.navigate("/agendamentos"),
      openInspiration: (foto) =>
        router.push({ pathname: "/portfolio/[id]", params: { id: foto.id, professionalId: foto.professionalId } }),
      openAllInspirations: () => router.push("/inspiracoes"),
    },
  ];
}
