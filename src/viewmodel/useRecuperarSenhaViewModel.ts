import { router } from "expo-router";
import { useState } from "react";

import { authUseCases } from "@/di/container";
import { DomainError, ValidationError } from "@/model/errors";
import type { IAuthUseCases } from "@/usecase/iAuthUseCases";

export type RecuperarSenhaState = {
  email: string;
  emailError: string | null;
  loading: boolean;
  /** Link enviado: a tela troca o formulário pela confirmação. */
  sent: boolean;
  errorMessage: string | null;
};

export type RecuperarSenhaActions = {
  setEmail: (email: string) => void;
  submit: () => void;
  backToLogin: () => void;
};

export function useRecuperarSenhaViewModel(
  auth: IAuthUseCases = authUseCases,
): [RecuperarSenhaState, RecuperarSenhaActions] {
  const [email, setEmailState] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = () => {
    if (loading) return;
    setLoading(true);
    setErrorMessage(null);
    auth
      .requestPasswordReset(email)
      .then(
        () => setSent(true),
        (erro: unknown) => {
          if (erro instanceof ValidationError) setEmailError(erro.fields.email ?? erro.message);
          else setErrorMessage(erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.");
        },
      )
      .finally(() => setLoading(false));
  };

  return [
    { email, emailError, loading, sent, errorMessage },
    {
      setEmail: (valor) => {
        setEmailState(valor);
        setEmailError(null);
        setErrorMessage(null);
      },
      submit,
      backToLogin: () => router.dismissTo("/login"),
    },
  ];
}
