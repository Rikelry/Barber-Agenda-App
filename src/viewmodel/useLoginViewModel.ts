import { router } from "expo-router";
import { useState } from "react";

import { authUseCases } from "@/di/container";
import { DomainError, ValidationError } from "@/model/errors";
import type { IAuthUseCases, LoginField, LoginForm } from "@/usecase/iAuthUseCases";

export type LoginState = {
  form: LoginForm;
  fieldErrors: Partial<Record<LoginField, string>>;
  loading: boolean;
  /** Erro geral (credenciais, rede), mostrado acima do botão. */
  errorMessage: string | null;
};

export type LoginActions = {
  setField: (field: LoginField, value: string) => void;
  submit: () => void;
  goRecoverPassword: () => void;
  goRegister: () => void;
};

export function useLoginViewModel(auth: IAuthUseCases = authUseCases): [LoginState, LoginActions] {
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<LoginField, string>>>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = () => {
    if (loading) return;
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

  return [
    { form, fieldErrors, loading, errorMessage },
    {
      setField: (field, value) => {
        setForm((atual) => ({ ...atual, [field]: value }));
        setFieldErrors((atual) => ({ ...atual, [field]: undefined }));
        setErrorMessage(null);
      },
      submit,
      goRecoverPassword: () => router.push("/recuperar-senha"),
      goRegister: () => router.push("/cadastro"),
    },
  ];
}
