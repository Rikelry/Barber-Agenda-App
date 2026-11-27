import type { AgendaScope } from "@/model/datasources/iAgendaDataSource";
import type { AgendaAppointment } from "@/model/entities/agendaAppointment";

export type AgendaEntry =
  | { kind: "appointment"; appointment: AgendaAppointment }
  /** Faixa livre do horário de funcionamento (só na agenda do profissional). */
  | { kind: "free"; startsAt: Date; endsAt: Date };

export type AgendaOverview = {
  /** Pedidos pendentes ou com horário sugerido que ainda não passaram, do mais próximo ao mais distante. */
  requests: AgendaAppointment[];
  /** A barbearia não abre no dia escolhido. */
  closed: boolean;
  /** Os horários do dia em ordem (menos os recusados) e as faixas livres. */
  day: AgendaEntry[];
  /** Dias ("YYYY-MM-DD") com algum horário ativo ou concluído, para marcar no calendário. */
  markedDays: string[];
};

/** Barbearia onde o profissional logado atende. */
export type AgendaWorkplace = { barbershopId: string; name: string };

export interface IAgendaUseCases {
  getOverview(scope: AgendaScope, date: string, now?: Date): Promise<AgendaOverview>;
  /** As barbearias do profissional logado (para o seletor da aba Trabalho). */
  listWorkplaces(): Promise<AgendaWorkplace[]>;
  approve(appointment: AgendaAppointment, now?: Date): Promise<void>;
  /** O motivo é opcional (até 200 caracteres) e aparece para o cliente. */
  reject(appointment: AgendaAppointment, reason?: string): Promise<void>;
  /** Horários livres do profissional no dia; no dia de hoje, só os que ainda não passaram. */
  getAvailableSlots(appointment: AgendaAppointment, date: string, now?: Date): Promise<string[]>;
  /** Sugere outro horário a um pedido pendente; o cliente aceita ou recusa. Erros em ValidationError. */
  propose(appointment: AgendaAppointment, date: string, time: string | null, now?: Date): Promise<void>;
  /** Confirmado que já pode começar (a partir de 15 min antes). */
  start(appointment: AgendaAppointment, now?: Date): Promise<void>;
  /** Em andamento, ou confirmado que já começou. */
  complete(appointment: AgendaAppointment, now?: Date): Promise<void>;
  /** Confirmado cujo horário já começou. */
  noShow(appointment: AgendaAppointment, now?: Date): Promise<void>;
  /** Pendente, aguardando o cliente ou confirmado. */
  cancel(appointment: AgendaAppointment): Promise<void>;
}
