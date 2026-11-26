import { router } from "expo-router";
import { useState } from "react";

import { authUseCases } from "@/di/container";
import { DomainError, ValidationError } from "@/model/errors";
import type { IAuthUseCases, LoginField, LoginForm } from "@/usecase/iAuthUseCases";

export type LoginState = {
  form: LoginForm;
  fieldErrors: Partial<Record<LoginField, string>>;
  loading: boolean;
  /** Login com Google em andamento (seletor de contas aberto ou validando no servidor). */
  googleLoading: boolean;
  /** Erro geral (credenciais, rede), mostrado acima do botão. */
  errorMessage: string | null;
};

export type LoginActions = {
  setField: (field: LoginField, value: string) => void;
  submit: () => void;
  loginWithGoogle: () => void;
  goRecoverPassword: () => void;
  goRegister: () => void;
};

export function useLoginViewModel(auth: IAuthUseCases = authUseCases): [LoginState, LoginActions] {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<LoginField, string>>>({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = () => {
    if (loading || googleLoading) return;
    setLoading(true);
    setErrorMessage(null);
    auth
      .login(form)
      .then(
        () => router.replace("/"),
        (erro: unknown) => {
          if (erro instanceof ValidationError) setFieldErrors(erro.fields);
          else setErrorMessage(erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.");
        },
      )
      .finally(() => setLoading(false));
  };

  const loginWithGoogle = () => {
    if (loading || googleLoading) return;
    setGoogleLoading(true);
    setErrorMessage(null);
    auth
      .loginWithGoogle()
      .then(
        () => router.replace("/"),
        (erro: unknown) =>
          setErrorMessage(erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo."),
      )
      .finally(() => setGoogleLoading(false));
  };

  return [
    { form, fieldErrors, loading, googleLoading, errorMessage },
    {
      setField: (field, value) => {
        setForm((atual) => ({ ...atual, [field]: value }));
        setFieldErrors((atual) => ({ ...atual, [field]: undefined }));
        setErrorMessage(null);
      },
      submit,
      loginWithGoogle,
      goRecoverPassword: () => router.push("/recuperar-senha"),
      goRegister: () => router.push("/cadastro"),
    },
  ];
}
