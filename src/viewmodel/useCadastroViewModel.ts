import { router } from "expo-router";
import { useState } from "react";

import { authUseCases } from "@/di/container";
import { DomainError, ValidationError } from "@/model/errors";
import type { IAuthUseCases, RegisterField, RegisterForm } from "@/usecase/iAuthUseCases";

export type CadastroState = {
  form: RegisterForm;
  fieldErrors: Partial<Record<RegisterField, string>>;
  loading: boolean;
  errorMessage: string | null;
};

export type CadastroActions = {
  setField: (field: RegisterField, value: string) => void;
  submit: () => void;
};

const VAZIO: RegisterForm = { name: "", email: "", phone: "", password: "", confirmPassword: "" };

export function useCadastroViewModel(auth: IAuthUseCases = authUseCases): [CadastroState, CadastroActions] {
  const [form, setForm] = useState<RegisterForm>(VAZIO);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<RegisterField, string>>>({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = () => {
    if (loading) return;
    setLoading(true);
    setErrorMessage(null);
    auth
      .register(form)
      // Conta criada e já entrou: vai para a Home sem deixar o cadastro na pilha.
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
    },
  ];
}
