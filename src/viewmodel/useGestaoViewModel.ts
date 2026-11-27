import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";

import { agendaUseCases, ownerUseCases } from "@/di/container";
import type { Barbershop } from "@/model/entities/barbershop";
import { DomainError } from "@/model/errors";
import type { IAgendaUseCases } from "@/usecase/iAgendaUseCases";
import type { IOwnerUseCases } from "@/usecase/iOwnerUseCases";
import { useAgendaViewModel, type AgendaActions, type AgendaState } from "@/viewmodel/useAgendaViewModel";

export type GestaoStatus = "loading" | "error" | "empty" | "content";

export type GestaoState = {
  /** Carregamento das barbearias do dono (a agenda tem o próprio status). */
  barbershopsStatus: GestaoStatus;
  barbershops: Barbershop[];
  selectedBarbershopId: string | null;
  barbershopsError: string | null;
  agenda: AgendaState;
};

export type GestaoActions = AgendaActions & {
  selectBarbershop: (barbershopId: string) => void;
  retryBarbershops: () => void;
  /** Sem barbearia: cadastrar a primeira. */
  createBarbershop: () => void;
};

/**
 * Aba Trabalho do dono (rota gestao): agenda e solicitações da barbearia (pedidos de todos os
 * profissionais, inclusive do dono que atende, e os horários do dia). Com mais de uma
 * barbearia, troca pelo seletor compacto.
 */
export function useGestaoViewModel(
  owner: IOwnerUseCases = ownerUseCases,
  agenda: IAgendaUseCases = agendaUseCases,
): [GestaoState, GestaoActions] {
  const [barbershopsStatus, setBarbershopsStatus] = useState<GestaoStatus>("loading");
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [selectedBarbershopId, setSelectedBarbershopId] = useState<string | null>(null);
  const [barbershopsError, setBarbershopsError] = useState<string | null>(null);

  const carregar = useCallback(() => {
    owner.listMyBarbershops().then(
      (minhas) => {
        const lista = minhas.map((m) => m.barbershop);
        setBarbershops(lista);
        // Mantém a escolhida se ela ainda existir; senão, a primeira.
        setSelectedBarbershopId((atual) => (atual && lista.some((b) => b.id === atual) ? atual : (lista[0]?.id ?? null)));
        setBarbershopsError(null);
        setBarbershopsStatus(lista.length === 0 ? "empty" : "content");
      },
      (erro: unknown) => {
        setBarbershopsError(erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.");
        setBarbershopsStatus("error");
      },
    );
  }, [owner]);

  // Recarrega ao voltar (ex.: criou ou renomeou uma barbearia).
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  const escopo = useMemo(
    () => (selectedBarbershopId ? { kind: "barbershop" as const, barbershopId: selectedBarbershopId } : null),
    [selectedBarbershopId],
  );
  const [agendaState, agendaActions] = useAgendaViewModel(escopo, agenda);

  return [
    { barbershopsStatus, barbershops, selectedBarbershopId, barbershopsError, agenda: agendaState },
    {
      ...agendaActions,
      selectBarbershop: (id) => setSelectedBarbershopId(id),
      retryBarbershops: () => {
        setBarbershopsStatus("loading");
        carregar();
      },
      createBarbershop: () => router.push("/minhas-barbearias/nova"),
    },
  ];
}
