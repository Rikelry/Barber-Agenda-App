import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";

import { agendaUseCases } from "@/di/container";
import type { AgendaScope } from "@/model/datasources/iAgendaDataSource";
import type { AgendaAppointment } from "@/model/entities/agendaAppointment";
import { DomainError, ValidationError } from "@/model/errors";
import type { AgendaEntry, IAgendaUseCases } from "@/usecase/iAgendaUseCases";

export type AgendaStatus = "loading" | "error" | "content";
export type AgendaSlotsStatus = "loading" | "error" | "empty" | "content";

export type AgendaDay = { iso: string; date: Date; selected: boolean; today: boolean; marked: boolean };

/** Sugerir outro horário (bottom sheet): semana própria e os horários livres do profissional. */
export type AgendaProposal = {
  appointment: AgendaAppointment;
  week: AgendaDay[];
  canGoToPreviousWeek: boolean;
  date: string;
  slotsStatus: AgendaSlotsStatus;
  slots: string[];
  time: string | null;
  sending: boolean;
  errors: Partial<Record<"date" | "time", string>>;
  message: string | null;
};

/** Recusar com confirmação e motivo opcional (diálogo). */
export type AgendaRejection = { appointment: AgendaAppointment; reason: string; error: string | null };

export type AgendaState = {
  status: AgendaStatus;
  /** Agenda de uma barbearia (dono): mostra o profissional de cada horário. */
  showProfessional: boolean;
  week: AgendaDay[];
  canGoToPreviousWeek: boolean;
  date: string;
  closed: boolean;
  /** Pedidos pendentes ou aguardando o cliente do dia escolhido. */
  requests: AgendaAppointment[];
  /** Pedidos em outros dias (a tela oferece ir até o mais próximo). */
  otherDaysRequests: number;
  day: AgendaEntry[];
  /** Quando a agenda foi carregada (decide se já dá para iniciar ou marcar não compareceu). */
  loadedAt: number;
  /** Horário com os detalhes abertos (bottom sheet). */
  details: AgendaAppointment | null;
  confirming: "cancel" | "no_show" | null;
  proposal: AgendaProposal | null;
  rejection: AgendaRejection | null;
  /** Ação em andamento (desabilita os botões). */
  actingId: string | null;
  /** Aviso temporário (Snackbar) com o resultado da última ação. */
  actionMessage: string | null;
  /** Erro da última ação dentro do sheet de detalhes. */
  detailsMessage: string | null;
  errorMessage: string | null;
};

export type AgendaActions = {
  selectDate: (iso: string) => void;
  previousWeek: () => void;
  nextWeek: () => void;
  retry: () => void;
  dismissMessage: () => void;
  /** Vai ao dia do pedido mais próximo fora do dia escolhido. */
  showNextRequest: () => void;
  approve: (appointment: AgendaAppointment) => void;
  openDetails: (appointment: AgendaAppointment) => void;
  closeDetails: () => void;
  start: () => void;
  complete: () => void;
  askConfirm: (what: "cancel" | "no_show") => void;
  dismissConfirm: () => void;
  confirm: () => void;
  askReject: (appointment: AgendaAppointment) => void;
  changeRejectReason: (reason: string) => void;
  dismissReject: () => void;
  confirmReject: () => void;
  openProposal: (appointment: AgendaAppointment) => void;
  closeProposal: () => void;
  proposalSelectDate: (iso: string) => void;
  proposalPreviousWeek: () => void;
  proposalNextWeek: () => void;
  proposalSelectTime: (time: string) => void;
  proposalRetrySlots: () => void;
  sendProposal: () => void;
};

const doisDigitos = (n: number) => String(n).padStart(2, "0");
const isoDe = (d: Date) => `${d.getFullYear()}-${doisDigitos(d.getMonth() + 1)}-${doisDigitos(d.getDate())}`;
const segundaDe = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7));
const somarDias = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const primeiroNome = (nome: string) => nome.split(" ")[0] ?? nome;

const mensagem = (erro: unknown) => (erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.");

const semana = (inicio: Date, escolhido: string, hoje: string, marcados: string[] = []): AgendaDay[] =>
  Array.from({ length: 7 }, (_, i) => {
    const d = somarDias(inicio, i);
    const iso = isoDe(d);
    return { iso, date: d, selected: iso === escolhido, today: iso === hoje, marked: marcados.includes(iso) };
  });

/**
 * Aba Trabalho (barbeiro e dono): calendário da semana com os dias marcados, as solicitações do dia (aprovar, recusar com motivo, sugerir outro horário) e a linha do tempo com os
 * detalhes de cada horário num bottom sheet (iniciar, finalizar, não compareceu, cancelar).
 */
export function useAgendaViewModel(
  /** null: ainda não se sabe de quem é a agenda (ex.: as barbearias estão carregando). */
  scope: AgendaScope | null,
  useCases: IAgendaUseCases = agendaUseCases,
): [AgendaState, AgendaActions] {
  const hoje = isoDe(new Date());
  const [date, setDate] = useState(hoje);
  const [weekStart, setWeekStart] = useState(() => segundaDe(new Date()));
  const [status, setStatus] = useState<AgendaStatus>("loading");
  const [closed, setClosed] = useState(false);
  const [requests, setRequests] = useState<AgendaAppointment[]>([]);
  const [day, setDay] = useState<AgendaEntry[]>([]);
  const [markedDays, setMarkedDays] = useState<string[]>([]);
  const [loadedAt, setLoadedAt] = useState(() => Date.now());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [details, setDetails] = useState<AgendaAppointment | null>(null);
  const [confirming, setConfirming] = useState<"cancel" | "no_show" | null>(null);
  const [detailsMessage, setDetailsMessage] = useState<string | null>(null);
  const [rejection, setRejection] = useState<AgendaRejection | null>(null);
  const [proposal, setProposal] = useState<Omit<AgendaProposal, "week" | "canGoToPreviousWeek"> & { weekStart: Date } | null>(null);
  const [actingId, setActingId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const pedido = useRef(0);
  const pedidoSlots = useRef(0);
  const diaAtual = useRef(hoje);
  // A chave do escopo evita recarregar quando o objeto muda mas aponta para a mesma agenda.
  const chave = scope ? `${scope.kind}:${scope.barbershopId ?? ""}` : null;

  const carregar = useCallback(
    (dia: string) => {
      if (!chave) return;
      const [kind, barbershopId] = chave.split(":");
      const alvo: AgendaScope =
        kind === "barbershop"
          ? { kind: "barbershop", barbershopId: barbershopId ?? "" }
          : { kind: "professional", ...(barbershopId ? { barbershopId } : {}) };
      const atual = ++pedido.current;
      useCases.getOverview(alvo, dia).then(
        (visao) => {
          if (atual !== pedido.current) return;
          setRequests(visao.requests);
          setClosed(visao.closed);
          setDay(visao.day);
          setMarkedDays(visao.markedDays);
          setLoadedAt(Date.now());
          setErrorMessage(null);
          setStatus("content");
        },
        (erro: unknown) => {
          if (atual !== pedido.current) return;
          setErrorMessage(mensagem(erro));
          setStatus("error");
        },
      );
    },
    [useCases, chave],
  );

  // Recarrega ao voltar e quando muda a barbearia.
  useFocusEffect(
    useCallback(() => {
      setActionMessage(null);
      setStatus("loading");
      carregar(diaAtual.current);
    }, [carregar]),
  );

  /** Executa a ação; no sucesso fecha sheets e diálogos e recarrega. */
  const agir = (id: string, acao: () => Promise<void>, sucesso: string, onErro: (erro: unknown) => void) => {
    if (actingId) return;
    setActingId(id);
    setActionMessage(null);
    setDetailsMessage(null);
    acao()
      .then(
        () => {
          setDetails(null);
          setConfirming(null);
          setRejection(null);
          setProposal(null);
          setActionMessage(sucesso);
          carregar(diaAtual.current);
        },
        onErro,
      )
      .finally(() => setActingId(null));
  };
  const naTela = (erro: unknown) => setActionMessage(mensagem(erro));
  const noSheet = (erro: unknown) => setDetailsMessage(mensagem(erro));

  const escolherDia = (iso: string) => {
    setDate(iso);
    diaAtual.current = iso;
    setStatus("loading");
    carregar(iso);
  };

  const carregarHorarios = (agendamento: AgendaAppointment, dia: string) => {
    const atual = ++pedidoSlots.current;
    setProposal((p) => (p ? { ...p, date: dia, time: null, errors: {}, message: null, slotsStatus: "loading" } : p));
    useCases.getAvailableSlots(agendamento, dia).then(
      (lista) => {
        if (atual !== pedidoSlots.current) return;
        setProposal((p) => (p ? { ...p, slots: lista, slotsStatus: lista.length === 0 ? "empty" : "content" } : p));
      },
      () => {
        if (atual === pedidoSlots.current) setProposal((p) => (p ? { ...p, slotsStatus: "error" } : p));
      },
    );
  };

  const segundaAtual = segundaDe(new Date());
  const doDia = requests.filter((r) => isoDe(r.startsAt) === date);
  const proximoPedido = requests.find((r) => isoDe(r.startsAt) !== date && isoDe(r.startsAt) >= hoje);
  const dismissMessage = useCallback(() => setActionMessage(null), []);
  const sugerirNaSemana = (inicio: Date) => {
    if (!proposal) return;
    const dia = inicio.getTime() < segundaAtual.getTime() ? new Date() : inicio;
    setProposal({ ...proposal, weekStart: inicio });
    carregarHorarios(proposal.appointment, isoDe(dia));
  };

  const fechar = () => {
    setDetails(null);
    setConfirming(null);
    setDetailsMessage(null);
  };

  return [
    {
      status,
      showProfessional: scope?.kind === "barbershop",
      week: semana(weekStart, date, hoje, markedDays),
      canGoToPreviousWeek: weekStart.getTime() > segundaAtual.getTime(),
      date,
      closed,
      requests: doDia,
      otherDaysRequests: requests.length - doDia.length,
      day,
      loadedAt,
      details,
      confirming,
      proposal: proposal
        ? {
            ...proposal,
            week: semana(proposal.weekStart, proposal.date, hoje),
            canGoToPreviousWeek: proposal.weekStart.getTime() > segundaAtual.getTime(),
          }
        : null,
      rejection,
      actingId,
      actionMessage,
      detailsMessage,
      errorMessage,
    },
    {
      selectDate: escolherDia,
      previousWeek: () => {
        const inicio = somarDias(weekStart, -7);
        setWeekStart(inicio);
        escolherDia(isoDe(inicio.getTime() < segundaAtual.getTime() ? new Date() : inicio));
      },
      nextWeek: () => {
        const inicio = somarDias(weekStart, 7);
        setWeekStart(inicio);
        escolherDia(isoDe(inicio));
      },
      retry: () => {
        setStatus("loading");
        carregar(date);
      },
      dismissMessage,
      showNextRequest: () => {
        if (!proximoPedido) return;
        setWeekStart(segundaDe(proximoPedido.startsAt));
        escolherDia(isoDe(proximoPedido.startsAt));
      },
      approve: (a) =>
        agir(a.id, () => useCases.approve(a), `Pedido de ${primeiroNome(a.clientName)} aprovado.`, details ? noSheet : naTela),
      openDetails: (a) => {
        setDetails(a);
        setConfirming(null);
        setDetailsMessage(null);
      },
      closeDetails: fechar,
      start: () => {
        const a = details;
        if (a) agir(a.id, () => useCases.start(a), `Atendimento de ${primeiroNome(a.clientName)} iniciado.`, noSheet);
      },
      complete: () => {
        const a = details;
        if (a) agir(a.id, () => useCases.complete(a), "Atendimento finalizado.", noSheet);
      },
      askConfirm: (what) => {
        setConfirming(what);
        setDetailsMessage(null);
      },
      dismissConfirm: () => setConfirming(null),
      confirm: () => {
        const a = details;
        if (!a || !confirming) return;
        if (confirming === "cancel") agir(a.id, () => useCases.cancel(a), "Horário cancelado.", noSheet);
        else agir(a.id, () => useCases.noShow(a), `${primeiroNome(a.clientName)} marcado como não compareceu.`, noSheet);
      },
      askReject: (a) => {
        setDetails(null);
        setRejection({ appointment: a, reason: "", error: null });
      },
      changeRejectReason: (reason) => setRejection((r) => (r ? { ...r, reason, error: null } : r)),
      dismissReject: () => setRejection(null),
      confirmReject: () => {
        const r = rejection;
        if (!r) return;
        agir(
          r.appointment.id,
          () => useCases.reject(r.appointment, r.reason),
          `Pedido de ${primeiroNome(r.appointment.clientName)} recusado.`,
          (erro) =>
            setRejection((atual) =>
              atual ? { ...atual, error: erro instanceof ValidationError ? (erro.fields.reason ?? erro.message) : mensagem(erro) } : atual,
            ),
        );
      },
      openProposal: (a) => {
        setDetails(null);
        // Começa no dia pedido (ou hoje, se já passou).
        const inicio = a.startsAt.getTime() > Date.now() ? a.startsAt : new Date();
        setProposal({
          appointment: a,
          weekStart: segundaDe(inicio),
          date: isoDe(inicio),
          slotsStatus: "loading",
          slots: [],
          time: null,
          sending: false,
          errors: {},
          message: null,
        });
        carregarHorarios(a, isoDe(inicio));
      },
      closeProposal: () => setProposal(null),
      proposalSelectDate: (iso) => {
        if (proposal && iso >= hoje) carregarHorarios(proposal.appointment, iso);
      },
      proposalPreviousWeek: () => {
        if (proposal) sugerirNaSemana(somarDias(proposal.weekStart, -7));
      },
      proposalNextWeek: () => {
        if (proposal) sugerirNaSemana(somarDias(proposal.weekStart, 7));
      },
      proposalSelectTime: (time) => setProposal((p) => (p ? { ...p, time, errors: {}, message: null } : p)),
      proposalRetrySlots: () => {
        if (proposal) carregarHorarios(proposal.appointment, proposal.date);
      },
      sendProposal: () => {
        const p = proposal;
        if (!p || p.sending) return;
        setProposal({ ...p, sending: true, errors: {}, message: null });
        agir(
          p.appointment.id,
          () => useCases.propose(p.appointment, p.date, p.time),
          `Sugestão enviada para ${primeiroNome(p.appointment.clientName)}.`,
          (erro) => {
            setProposal((atual) =>
              atual
                ? {
                    ...atual,
                    sending: false,
                    errors: erro instanceof ValidationError ? erro.fields : {},
                    message: erro instanceof ValidationError ? null : mensagem(erro),
                  }
                : atual,
            );
          },
        );
      },
    },
  ];
}
