import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { barbershopUseCases } from "@/di/container";
import { DomainError } from "@/model/errors";
import type { BarberProfile, IBarbershopUseCases } from "@/usecase/iBarbershopUseCases";

export type PerfilBarbeiroStatus = "loading" | "error" | "content";

export type PerfilBarbeiroState = {
  status: PerfilBarbeiroStatus;
  profile: BarberProfile | null;
  errorMessage: string | null;
};

export type PerfilBarbeiroActions = {
  retry: () => void;
  openBarbershop: () => void;
};

export function usePerfilBarbeiroViewModel(
  useCases: IBarbershopUseCases = barbershopUseCases,
): [PerfilBarbeiroState, PerfilBarbeiroActions] {
  const { id, barbershopId } = useLocalSearchParams<{ id: string; barbershopId: string }>();
  const [status, setStatus] = useState<PerfilBarbeiroStatus>("loading");
  const [profile, setProfile] = useState<BarberProfile | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pedido = useRef(0);

  const carregar = useCallback(() => {
    const atual = ++pedido.current;
    if (!barbershopId) return;
    useCases.getBarberProfile(barbershopId, id).then(
      (dados) => {
        if (atual !== pedido.current) return;
        setProfile(dados);
        setErrorMessage(null);
        setStatus("content");
      },
      (erro: unknown) => {
        if (atual !== pedido.current) return;
        setErrorMessage(erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.");
        setStatus("error");
      },
    );
  }, [id, barbershopId, useCases]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Link sem a barbearia: não há o que buscar.
  const semBarbearia = !barbershopId;

  return [
    semBarbearia
      ? { status: "error", profile: null, errorMessage: "Não sabemos em qual barbearia este barbeiro trabalha." }
      : { status, profile, errorMessage },
    {
      retry: () => {
        if (semBarbearia) return;
        setStatus("loading");
        carregar();
      },
      openBarbershop: () => {
        if (barbershopId) router.push({ pathname: "/barbearia/[id]", params: { id: barbershopId } });
      },
    },
  ];
}
