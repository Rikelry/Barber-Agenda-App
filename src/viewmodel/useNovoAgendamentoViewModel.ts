import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { appointmentUseCases, barbershopUseCases } from "@/di/container";
import type { Appointment } from "@/model/entities/appointment";
import type { Barbershop } from "@/model/entities/barbershop";
import type { Professional } from "@/model/entities/professional";
import type { Service } from "@/model/entities/service";
import { DomainError, ValidationError } from "@/model/errors";
import { toIsoDate } from "@/usecase/appointmentUseCases";
import type { IAppointmentUseCases } from "@/usecase/iAppointmentUseCases";
import type { IBarbershopUseCases } from "@/usecase/iBarbershopUseCases";

export type NovoAgendamentoStatus = "loading" | "error" | "content";
export type HorariosStatus = "idle" | "loading" | "error" | "empty" | "content";
export type CampoAgendamento = "professionalId" | "date" | "time";
/** Passos do agendamento (canvas de telas): 1 escolher profissional e horário, 2 revisar, e o sucesso. */
export type PassoAgendamento = "escolha" | "revisao" | "sucesso";

export type DiaDaSemana = {
  iso: string;
  date: Date;
  selected: boolean;
  today: boolean;
  /** Dias passados não podem ser escolhidos (padrão 2 de 05-padroes.md). */
  disabled: boolean;
};

export type NovoAgendamentoState = {
  status: NovoAgendamentoStatus;
  step: PassoAgendamento;
  /** Preenchido quando a tela foi aberta para reagendar. */
  rescheduling: Appointment | null;
  barbershop: Barbershop | null;
  service: Service | null;
  professionals: Professional[];
  professionalId: string | null;
  date: string;
  week: DiaDaSemana[];
  canGoToPreviousWeek: boolean;
  slots: string[];
  slotsStatus: HorariosStatus;
  time: string | null;
  /** Fim do atendimento ("15:40") para o horário escolhido, pela duração do serviço. */
  endTime: string | null;
  saving: boolean;
  fieldErrors: Partial<Record<CampoAgendamento, string>>;
  errorMessage: string | null;
};

export type NovoAgendamentoActions = {
  selectProfessional: (professionalId: string) => void;
  selectDate: (iso: string) => void;
  previousWeek: () => void;
  nextWeek: () => void;
  selectTime: (time: string) => void;
  /** Passo 1 → 2: confere se escolheu profissional e horário e abre a revisão. */
  review: () => void;
  /** Volta da revisão para trocar profissional ou horário. */
  editChoice: () => void;
  confirm: () => void;
  openAppointments: () => void;
  goHome: () => void;
  retry: () => void;
  retrySlots: () => void;
  goBack: () => void;
};

const DIA_MS = 86400000;
const inicioDoDia = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
/** Domingo da semana da data. */
const inicioDaSemana = (d: Date) => new Date(inicioDoDia(d).getTime() - d.getDay() * DIA_MS);
const somarDias = (d: Date, dias: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + dias);

const somarMinutos = (hora: string, minutos: number) => {
  const [h = 0, m = 0] = hora.split(":").map(Number);
  const total = h * 60 + m + minutos;
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

const mensagem = (erro: unknown) =>
  erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.";

export function useNovoAgendamentoViewModel(
  agendamentos: IAppointmentUseCases = appointmentUseCases,
  barbearias: IBarbershopUseCases = barbershopUseCases,
): [NovoAgendamentoState, NovoAgendamentoActions] {
  const params = useLocalSearchParams<{
    barbershopId?: string;
    serviceId?: string;
    professionalId?: string;
    appointmentId?: string;
  }>();
  const hoje = toIsoDate(new Date());

  const [status, setStatus] = useState<NovoAgendamentoStatus>("loading");
  const [step, setStep] = useState<PassoAgendamento>("escolha");
  const [rescheduling, setRescheduling] = useState<Appointment | null>(null);
  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [professionalId, setProfessionalId] = useState<string | null>(params.professionalId ?? null);
  const [date, setDate] = useState(hoje);
  const [weekStart, setWeekStart] = useState(() => inicioDaSemana(new Date()));
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsStatus, setSlotsStatus] = useState<HorariosStatus>("idle");
  const [time, setTime] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<CampoAgendamento, string>>>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pedidoHorarios = useRef(0);

  const carregarHorarios = useCallback(
    (barbearia: string, servico: string, profissional: string | null, dia: string) => {
      const atual = ++pedidoHorarios.current;
      if (!profissional) {
        setSlots([]);
        setSlotsStatus("idle");
        return;
      }
      setSlotsStatus("loading");
      agendamentos.getAvailableSlots(barbearia, profissional, servico, dia).then(
        (lista) => {
          if (atual !== pedidoHorarios.current) return;
          setSlots(lista);
          setSlotsStatus(lista.length === 0 ? "empty" : "content");
        },
        () => {
          if (atual !== pedidoHorarios.current) return;
          setSlotsStatus("error");
        },
      );
    },
    [agendamentos],
  );

  const carregar = useCallback(() => {
    const deOndeVem = params.appointmentId
      ? agendamentos.listMyAppointments().then(({ upcoming }) => {
          const atual = upcoming.find((a) => a.id === params.appointmentId);
          if (!atual) throw new DomainError("Esse agendamento não pode mais ser reagendado.", "NOT_FOUND");
          return atual;
        })
      : Promise.resolve(null);

    deOndeVem
      .then(async (atual) => {
        const barbeariaId = atual?.barbershopId ?? params.barbershopId ?? "";
        const servicoId = atual?.serviceId ?? params.serviceId ?? "";
        const detalhe = await barbearias.getBarbershopDetail(barbeariaId);
        const servico = detalhe.services.find((s) => s.id === servicoId);
        if (!servico) throw new DomainError("Esse serviço não está mais disponível.", "NOT_FOUND");
        // Com um profissional só, ele já vem escolhido.
        const escolhido =
          atual?.professionalId ??
          params.professionalId ??
          (detalhe.professionals.length === 1 ? (detalhe.professionals[0]?.id ?? null) : null);
        return { atual, detalhe, servico, escolhido };
      })
      .then(
        ({ atual, detalhe, servico, escolhido }) => {
          setRescheduling(atual);
          setBarbershop(detalhe.barbershop);
          setService(servico);
          setProfessionals(detalhe.professionals);
          setProfessionalId(escolhido);
          setErrorMessage(null);
          setStatus("content");
          carregarHorarios(detalhe.barbershop.id, servico.id, escolhido, hoje);
        },
        (erro: unknown) => {
          setErrorMessage(mensagem(erro));
          setStatus("error");
        },
      );
  }, [agendamentos, barbearias, carregarHorarios, hoje, params.appointmentId, params.barbershopId, params.professionalId, params.serviceId]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const recarregarHorarios = (profissional: string | null, dia: string) => {
    setTime(null);
    setFieldErrors({});
    if (barbershop && service) carregarHorarios(barbershop.id, service.id, profissional, dia);
  };

  const week: DiaDaSemana[] = Array.from({ length: 7 }, (_, i) => {
    const dia = somarDias(weekStart, i);
    const iso = toIsoDate(dia);
    return { iso, date: dia, selected: iso === date, today: iso === hoje, disabled: iso < hoje };
  });

  const confirm = () => {
    if (saving || !barbershop || !service) return;
    setSaving(true);
    setErrorMessage(null);
    const pedido = rescheduling
      ? agendamentos.reschedule(rescheduling, date, time)
      : agendamentos.book({ barbershopId: barbershop.id, serviceId: service.id, professionalId, date, time });
    pedido
      .then(
        () => setStep("sucesso"),
        (erro: unknown) => {
          // Erro de campo ou horário ocupado: volta ao passo 1 com o aviso.
          setStep("escolha");
          if (erro instanceof ValidationError) setFieldErrors(erro.fields);
          else setErrorMessage(mensagem(erro));
          // O horário pode ter sido ocupado por outra pessoa: atualiza a lista.
          if (!(erro instanceof ValidationError)) recarregarHorarios(professionalId, date);
        },
      )
      .finally(() => setSaving(false));
  };

  return [
    {
      status,
      step,
      rescheduling,
      barbershop,
      service,
      professionals,
      professionalId,
      date,
      week,
      canGoToPreviousWeek: weekStart.getTime() > inicioDaSemana(new Date()).getTime(),
      slots,
      slotsStatus,
      time,
      endTime: time && service ? somarMinutos(time, service.durationMinutes) : null,
      saving,
      fieldErrors,
      errorMessage,
    },
    {
      selectProfessional: (id) => {
        if (rescheduling) return;
        setProfessionalId(id);
        recarregarHorarios(id, date);
      },
      selectDate: (iso) => {
        if (iso < hoje) return;
        setDate(iso);
        recarregarHorarios(professionalId, iso);
      },
      previousWeek: () => setWeekStart((s) => somarDias(s, -7)),
      nextWeek: () => setWeekStart((s) => somarDias(s, 7)),
      selectTime: (hora) => {
        setTime(hora);
        setFieldErrors((e) => ({ ...e, time: undefined }));
      },
      review: () => {
        const erros: Partial<Record<CampoAgendamento, string>> = {};
        if (!professionalId) erros.professionalId = "Escolha o profissional.";
        if (!time) erros.time = "Escolha um horário.";
        setFieldErrors(erros);
        if (Object.keys(erros).length === 0) {
          setErrorMessage(null);
          setStep("revisao");
        }
      },
      editChoice: () => setStep("escolha"),
      confirm,
      openAppointments: () => router.dismissTo("/agendamentos"),
      goHome: () => router.dismissTo("/"),
      retry: () => {
        setStatus("loading");
        carregar();
      },
      retrySlots: () => recarregarHorarios(professionalId, date),
      goBack: () => {
        if (step === "revisao") setStep("escolha");
        else if (step === "sucesso") router.dismissTo("/agendamentos");
        else if (router.canGoBack()) router.back();
        else router.replace("/");
      },
    },
  ];
}
