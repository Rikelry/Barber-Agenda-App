import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import { agendaUseCases } from "@/di/container";
import { DomainError } from "@/model/errors";
import type { AgendaWorkplace, IAgendaUseCases } from "@/usecase/iAgendaUseCases";
import { useAgendaViewModel, type AgendaActions, type AgendaState } from "@/viewmodel/useAgendaViewModel";

export type MinhaAgendaState = {
  /** Carregamento das barbearias onde o barbeiro atende (a agenda tem o próprio status). */
  workplacesStatus: "loading" | "error" | "content";
  workplaces: AgendaWorkplace[];
  selectedBarbershopId: string | null;
  workplacesError: string | null;
  agenda: AgendaState;
};

export type MinhaAgendaActions = AgendaActions & {
  selectBarbershop: (barbershopId: string) => void;
  retryWorkplaces: () => void;
  /** Bloqueios: folgas e horários em que o barbeiro não atende. */
  openBlocks: () => void;
};

/**
 * Aba Trabalho do barbeiro (rota agenda): a agenda dele na barbearia escolhida. Quem atende em
 * mais de uma barbearia troca pelo seletor; o backend só devolve os horários dele.
 */
export function useMinhaAgendaViewModel(
  useCases: IAgendaUseCases = agendaUseCases,
): [MinhaAgendaState, MinhaAgendaActions] {
  const [workplacesStatus, setWorkplacesStatus] = useState<MinhaAgendaState["workplacesStatus"]>("loading");
  const [workplaces, setWorkplaces] = useState<AgendaWorkplace[]>([]);
  const [selectedBarbershopId, setSelectedBarbershopId] = useState<string | null>(null);
  const [workplacesError, setWorkplacesError] = useState<string | null>(null);

  const carregar = useCallback(() => {
    useCases.listWorkplaces().then(
      (lista) => {
        setWorkplaces(lista);
        setSelectedBarbershopId((atual) =>
          atual && lista.some((w) => w.barbershopId === atual) ? atual : (lista[0]?.barbershopId ?? null),
        );
        setWorkplacesError(null);
        setWorkplacesStatus("content");
      },
      (erro: unknown) => {
        setWorkplacesError(erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.");
        setWorkplacesStatus("error");
      },
    );
  }, [useCases]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  const escopo = useMemo(
    () => (selectedBarbershopId ? { kind: "professional" as const, barbershopId: selectedBarbershopId } : null),
    [selectedBarbershopId],
  );
  const [agenda, actions] = useAgendaViewModel(escopo, useCases);

  return [
    { workplacesStatus, workplaces, selectedBarbershopId, workplacesError, agenda },
    {
      ...actions,
      selectBarbershop: setSelectedBarbershopId,
      retryWorkplaces: () => {
        setWorkplacesStatus("loading");
        carregar();
      },
      openBlocks: () => router.push("/indisponibilidades"),
    },
  ];
}
