import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { authUseCases, professionalUseCases } from "@/di/container";
import type { User } from "@/model/entities/user";
import { DomainError } from "@/model/errors";
import type { IAuthUseCases } from "@/usecase/iAuthUseCases";
import type { IProfessionalUseCases, Workplace } from "@/usecase/iProfessionalUseCases";

export type MeuTrabalhoStatus = "loading" | "error" | "content";

export type MeuTrabalhoState = {
  status: MeuTrabalhoStatus;
  user: User | null;
  workplace: Workplace | null;
  /** Dia de hoje (0 = domingo) para destacar na semana. */
  today: number;
  errorMessage: string | null;
};

export type MeuTrabalhoActions = {
  retry: () => void;
  goBack: () => void;
};

export function useMeuTrabalhoViewModel(
  useCases: IProfessionalUseCases = professionalUseCases,
  auth: IAuthUseCases = authUseCases,
): [MeuTrabalhoState, MeuTrabalhoActions] {
  const [status, setStatus] = useState<MeuTrabalhoStatus>("loading");
  const [workplace, setWorkplace] = useState<Workplace | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const carregar = useCallback(() => {
    useCases.getWorkplace().then(
      (dados) => {
        setWorkplace(dados);
        setErrorMessage(null);
        setStatus("content");
      },
      (erro: unknown) => {
        setErrorMessage(erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.");
        setStatus("error");
      },
    );
  }, [useCases]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  return [
    { status, user: auth.getSession()?.user ?? null, workplace, today: new Date().getDay(), errorMessage },
    {
      retry: () => {
        setStatus("loading");
        carregar();
      },
      goBack: () => (router.canGoBack() ? router.back() : router.replace("/perfil")),
    },
  ];
}
