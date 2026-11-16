import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { professionalUseCases } from "@/di/container";
import { DomainError, ValidationError } from "@/model/errors";
import { toIsoDate } from "@/usecase/appointmentUseCases";
import type {
  BlockField,
  IProfessionalUseCases,
  MyBlocks,
  RecurringBlock,
} from "@/usecase/iProfessionalUseCases";
import { mascararHora } from "@/viewmodel/useHorariosBarbeariaViewModel";

export type IndisponibilidadesStatus = "loading" | "error" | "content";
export type IndisponibilidadesAba = "recorrente" | "pontual";

export type IndisponibilidadesState = {
  status: IndisponibilidadesStatus;
  tab: IndisponibilidadesAba;
  days: number[];
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
  fieldErrors: Partial<Record<BlockField, string>>;
  blocks: MyBlocks;
  /** Bloqueio com a confirmação de remover aberta ("r:<key>" ou "p:<id>"). */
  confirmingRemove: string | null;
  saving: boolean;
  successMessage: string | null;
  errorMessage: string | null;
};

export type IndisponibilidadesActions = {
  setTab: (tab: IndisponibilidadesAba) => void;
  toggleDay: (day: number) => void;
  setDate: (iso: string) => void;
  setStartTime: (value: string) => void;
  setEndTime: (value: string) => void;
  setReason: (value: string) => void;
  add: () => void;
  askRemove: (key: string) => void;
  dismissRemove: () => void;
  removeRecurring: (block: RecurringBlock) => void;
  removeOneOff: (id: string) => void;
  retry: () => void;
  goBack: () => void;
};

const VAZIO: MyBlocks = { recurring: [], oneOff: [] };

const mensagem = (erro: unknown) =>
  erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.";

export function useIndisponibilidadesViewModel(
  useCases: IProfessionalUseCases = professionalUseCases,
): [IndisponibilidadesState, IndisponibilidadesActions] {
  const [status, setStatus] = useState<IndisponibilidadesStatus>("loading");
  const [tab, setTab] = useState<IndisponibilidadesAba>("recorrente");
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [date, setDateState] = useState(toIsoDate(new Date()));
  const [startTime, setStart] = useState("12:00");
  const [endTime, setEnd] = useState("13:00");
  const [reason, setReasonState] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<BlockField, string>>>({});
  const [blocks, setBlocks] = useState<MyBlocks>(VAZIO);
  const [confirmingRemove, setConfirmingRemove] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const carregar = useCallback(() => {
    useCases.listMyBlocks().then(
      (lista) => {
        setBlocks(lista);
        setStatus("content");
      },
      (erro: unknown) => {
        setErrorMessage(mensagem(erro));
        setStatus("error");
      },
    );
  }, [useCases]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const limparAvisos = (campo?: BlockField) => {
    setSuccessMessage(null);
    setErrorMessage(null);
    if (campo) setFieldErrors((e) => ({ ...e, [campo]: undefined }));
  };

  const executar = (acao: Promise<void>, sucesso: string) => {
    setSaving(true);
    acao
      .then(
        () => {
          setSuccessMessage(sucesso);
          setConfirmingRemove(null);
          carregar();
        },
        (erro: unknown) => {
          if (erro instanceof ValidationError) setFieldErrors(erro.fields);
          else setErrorMessage(mensagem(erro));
        },
      )
      .finally(() => setSaving(false));
  };

  return [
    {
      status,
      tab,
      days,
      date,
      startTime,
      endTime,
      reason,
      fieldErrors,
      blocks,
      confirmingRemove,
      saving,
      successMessage,
      errorMessage,
    },
    {
      setTab: (t) => {
        setTab(t);
        setFieldErrors({});
        limparAvisos();
      },
      toggleDay: (dia) => {
        setDays((d) => (d.includes(dia) ? d.filter((x) => x !== dia) : [...d, dia]));
        limparAvisos("days");
      },
      setDate: (iso) => {
        setDateState(iso);
        limparAvisos("date");
      },
      setStartTime: (v) => {
        setStart(mascararHora(v));
        limparAvisos("startTime");
      },
      setEndTime: (v) => {
        setEnd(mascararHora(v));
        limparAvisos("endTime");
      },
      setReason: (v) => {
        setReasonState(v);
        limparAvisos();
      },
      add: () => {
        if (saving) return;
        setFieldErrors({});
        limparAvisos();
        executar(
          tab === "recorrente"
            ? useCases.addRecurringBlock({ days, startTime, endTime, reason })
            : useCases.addOneOffBlock({ date, startTime, endTime, reason }),
          "Bloqueio adicionado.",
        );
      },
      askRemove: (key) => setConfirmingRemove(key),
      dismissRemove: () => setConfirmingRemove(null),
      removeRecurring: (block) => executar(useCases.removeRecurringBlock(block), "Bloqueio removido."),
      removeOneOff: (id) => executar(useCases.removeOneOffBlock(id), "Bloqueio removido."),
      retry: () => {
        setStatus("loading");
        carregar();
      },
      goBack: () => (router.canGoBack() ? router.back() : router.replace("/minha-agenda")),
    },
  ];
}
