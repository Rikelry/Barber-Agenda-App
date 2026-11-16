import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { appointmentUseCases } from "@/di/container";
import type { Appointment } from "@/model/entities/appointment";
import { DomainError } from "@/model/errors";
import type { IAppointmentUseCases, MyAppointments } from "@/usecase/iAppointmentUseCases";

export type AgendamentosStatus = "loading" | "error" | "content";
export type AgendamentosAba = "proximos" | "historico";

export type AgendamentosState = {
  status: AgendamentosStatus;
  tab: AgendamentosAba;
  appointments: MyAppointments;
  /** Agendamento com a confirmação de cancelamento aberta. */
  confirmingCancelId: string | null;
  cancellingId: string | null;
  errorMessage: string | null;
};

export type AgendamentosActions = {
  setTab: (tab: AgendamentosAba) => void;
  retry: () => void;
  reschedule: (appointment: Appointment) => void;
  askCancel: (appointmentId: string) => void;
  dismissCancel: () => void;
  confirmCancel: () => void;
  findBarbershop: () => void;
};

const VAZIO: MyAppointments = { upcoming: [], history: [] };

const mensagem = (erro: unknown) =>
  erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.";

export function useAgendamentosViewModel(
  useCases: IAppointmentUseCases = appointmentUseCases,
): [AgendamentosState, AgendamentosActions] {
  const [status, setStatus] = useState<AgendamentosStatus>("loading");
  const [tab, setTab] = useState<AgendamentosAba>("proximos");
  const [appointments, setAppointments] = useState<MyAppointments>(VAZIO);
  const [confirmingCancelId, setConfirmingCancelId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const carregar = useCallback(() => {
    useCases.listMyAppointments().then(
      (lista) => {
        setAppointments(lista);
        setErrorMessage(null);
        setStatus("content");
      },
      (erro: unknown) => {
        setErrorMessage(mensagem(erro));
        setStatus("error");
      },
    );
  }, [useCases]);

  // Recarrega sempre que a tela volta a aparecer (ex.: depois de agendar ou reagendar).
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  const confirmCancel = () => {
    const id = confirmingCancelId;
    if (!id || cancellingId) return;
    setCancellingId(id);
    useCases
      .cancel(id)
      .then(
        () => {
          setConfirmingCancelId(null);
          carregar();
        },
        (erro: unknown) => setErrorMessage(mensagem(erro)),
      )
      .finally(() => setCancellingId(null));
  };

  return [
    { status, tab, appointments, confirmingCancelId, cancellingId, errorMessage },
    {
      setTab,
      retry: () => {
        setStatus("loading");
        carregar();
      },
      reschedule: (appointment) =>
        router.push({ pathname: "/agendamento/novo", params: { appointmentId: appointment.id } }),
      askCancel: (id) => {
        setErrorMessage(null);
        setConfirmingCancelId(id);
      },
      dismissCancel: () => setConfirmingCancelId(null),
      confirmCancel,
      findBarbershop: () => router.dismissTo("/barbearias"),
    },
  ];
}
