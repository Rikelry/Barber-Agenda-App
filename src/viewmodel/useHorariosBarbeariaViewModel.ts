import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { ownerUseCases } from "@/di/container";
import { DomainError, ValidationError } from "@/model/errors";
import type { DayHours, IOwnerUseCases } from "@/usecase/iOwnerUseCases";

export type HorariosBarbeariaStatus = "loading" | "error" | "content";

export type HorariosBarbeariaState = {
  status: HorariosBarbeariaStatus;
  week: DayHours[];
  /** Dias que já estavam salvos como abertos (a API não apaga dias). */
  savedOpenDays: number[];
  dayErrors: Record<string, string>;
  saving: boolean;
  successMessage: string | null;
  errorMessage: string | null;
};

export type HorariosBarbeariaActions = {
  setOpen: (dayOfWeek: number, open: boolean) => void;
  setTime: (dayOfWeek: number, field: "openTime" | "closeTime", value: string) => void;
  save: () => void;
  retry: () => void;
  goBack: () => void;
};

/** Máscara HH:mm enquanto digita: "930" → "09:30" só no fim; aqui só insere os dois-pontos. */
export const mascararHora = (texto: string) => {
  const d = texto.replace(/\D/g, "").slice(0, 4);
  return d.length <= 2 ? d : `${d.slice(0, 2)}:${d.slice(2)}`;
};

export function useHorariosBarbeariaViewModel(
  useCases: IOwnerUseCases = ownerUseCases,
): [HorariosBarbeariaState, HorariosBarbeariaActions] {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [status, setStatus] = useState<HorariosBarbeariaStatus>("loading");
  const [week, setWeek] = useState<DayHours[]>([]);
  const [savedOpenDays, setSavedOpenDays] = useState<number[]>([]);
  const [dayErrors, setDayErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const carregar = useCallback(() => {
    useCases.getWeekHours(id).then(
      (semana) => {
        setWeek(semana);
        setSavedOpenDays(semana.filter((d) => d.open).map((d) => d.dayOfWeek));
        setErrorMessage(null);
        setStatus("content");
      },
      (erro: unknown) => {
        setErrorMessage(erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.");
        setStatus("error");
      },
    );
  }, [id, useCases]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const mudar = (dia: number, alteracao: Partial<DayHours>) => {
    setWeek((s) => s.map((d) => (d.dayOfWeek === dia ? { ...d, ...alteracao } : d)));
    setDayErrors((e) => ({ ...e, [String(dia)]: "" }));
    setSuccessMessage(null);
  };

  const save = () => {
    if (saving) return;
    setSaving(true);
    setErrorMessage(null);
    useCases
      .saveWeekHours(id, week)
      .then(
        () => {
          setSavedOpenDays(week.filter((d) => d.open).map((d) => d.dayOfWeek));
          setDayErrors({});
          setSuccessMessage("Horários salvos.");
        },
        (erro: unknown) => {
          if (erro instanceof ValidationError) setDayErrors(erro.fields as Record<string, string>);
          else setErrorMessage(erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.");
        },
      )
      .finally(() => setSaving(false));
  };

  return [
    { status, week, savedOpenDays, dayErrors, saving, successMessage, errorMessage },
    {
      setOpen: (dia, open) => mudar(dia, { open }),
      setTime: (dia, campo, valor) => mudar(dia, { [campo]: mascararHora(valor) }),
      save,
      retry: () => {
        setStatus("loading");
        carregar();
      },
      goBack: () => (router.canGoBack() ? router.back() : router.replace("/minhas-barbearias")),
    },
  ];
}
