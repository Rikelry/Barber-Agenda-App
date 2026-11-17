import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";

import { authUseCases } from "@/di/container";
import { DomainError, ValidationError } from "@/model/errors";
import type { IAuthUseCases, ResetPasswordField, ResetPasswordForm } from "@/usecase/iAuthUseCases";

export type RedefinirSenhaState = {
  form: ResetPasswordForm;
  fieldErrors: Partial<Record<ResetPasswordField, string>>;
  loading: boolean;
  /** Senha trocada: a tela mostra a confirmação e o botão para entrar. */
  done: boolean;
  errorMessage: string | null;
};

export type RedefinirSenhaActions = {
  setField: (field: ResetPasswordField, value: string) => void;
  submit: () => void;
  goLogin: () => void;
};

export function useRedefinirSenhaViewModel(
  auth: IAuthUseCases = authUseCases,
): [RedefinirSenhaState, RedefinirSenhaActions] {
  // O link do e-mail é <app>/redefinir-senha?token=... (SolicitarRecuperacaoSenhaUseCase do backend).
  const { token } = useLocalSearchParams<{ token?: string }>();
  const [form, setForm] = useState<ResetPasswordForm>({ newPassword: "", confirmPassword: "" });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<ResetPasswordField, string>>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = () => {
    if (loading) return;
    setLoading(true);
    setErrorMessage(null);
    auth
      .resetPassword(token ?? "", form)
      .then(
        () => setDone(true),
        (erro: unknown) => {
          if (erro instanceof ValidationError) setFieldErrors(erro.fields);
          else setErrorMessage(erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.");
        },
      )
      .finally(() => setLoading(false));
  };

  return [
    { form, fieldErrors, loading, done, errorMessage },
    {
      setField: (field, value) => {
        setForm((atual) => ({ ...atual, [field]: value }));
        setFieldErrors((atual) => ({ ...atual, [field]: undefined }));
        setErrorMessage(null);
      },
      submit,
      goLogin: () => router.replace("/login"),
    },
  ];
}
