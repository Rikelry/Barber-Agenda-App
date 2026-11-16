import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";

import { professionalUseCases } from "@/di/container";
import { DomainError } from "@/model/errors";
import { toIsoDate } from "@/usecase/appointmentUseCases";
import type { AgendaItem, IProfessionalUseCases } from "@/usecase/iProfessionalUseCases";

export type MinhaAgendaStatus = "loading" | "error" | "content";

export type DiaAgenda = { iso: string; date: Date; selected: boolean; today: boolean };

export type MinhaAgendaState = {
  status: MinhaAgendaStatus;
  week: DiaAgenda[];
  date: string;
  closed: boolean;
  items: AgendaItem[];
  errorMessage: string | null;
};

export type MinhaAgendaActions = {
  selectDate: (iso: string) => void;
  retry: () => void;
  goBack: () => void;
  openBlocks: () => void;
};

/** Segunda a domingo da semana atual, como no layout. */
const semanaAtual = (hoje: Date): Date[] => {
  const segunda = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate() - ((hoje.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => new Date(segunda.getFullYear(), segunda.getMonth(), segunda.getDate() + i));
};

export function useMinhaAgendaViewModel(
  useCases: IProfessionalUseCases = professionalUseCases,
): [MinhaAgendaState, MinhaAgendaActions] {
  const hoje = toIsoDate(new Date());
  const [date, setDate] = useState(hoje);
  const [status, setStatus] = useState<MinhaAgendaStatus>("loading");
  const [closed, setClosed] = useState(false);
  const [items, setItems] = useState<AgendaItem[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pedido = useRef(0);
  const diaAtual = useRef(hoje);

  const carregar = useCallback(
    (dia: string) => {
      const atual = ++pedido.current;
      useCases.getDayAgenda(dia).then(
        (agenda) => {
          if (atual !== pedido.current) return;
          setClosed(agenda.closed);
          setItems(agenda.items);
          setErrorMessage(null);
          setStatus("content");
        },
        (erro: unknown) => {
          if (atual !== pedido.current) return;
          setErrorMessage(erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.");
          setStatus("error");
        },
      );
    },
    [useCases],
  );

  // Recarrega ao voltar (ex.: depois de mexer nas indisponibilidades).
  useFocusEffect(
    useCallback(() => {
      carregar(diaAtual.current);
    }, [carregar]),
  );

  const week = semanaAtual(new Date()).map((d) => {
    const iso = toIsoDate(d);
    return { iso, date: d, selected: iso === date, today: iso === hoje };
  });

  return [
    { status, week, date, closed, items, errorMessage },
    {
      selectDate: (iso) => {
        setDate(iso);
        diaAtual.current = iso;
        setStatus("loading");
        carregar(iso);
      },
      retry: () => {
        setStatus("loading");
        carregar(date);
      },
      goBack: () => (router.canGoBack() ? router.back() : router.replace("/perfil")),
      openBlocks: () => router.push("/indisponibilidades"),
    },
  ];
}
