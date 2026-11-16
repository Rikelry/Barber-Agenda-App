import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { authUseCases, profileUseCases } from "@/di/container";
import type { User } from "@/model/entities/user";
import { DomainError, ValidationError } from "@/model/errors";
import type { IAuthUseCases } from "@/usecase/iAuthUseCases";
import type { IProfileUseCases, ProfileField, ProfileForm } from "@/usecase/iProfileUseCases";

export type PerfilStatus = "loading" | "error" | "content";

export type PerfilState = {
  status: PerfilStatus;
  user: User | null;
  form: ProfileForm;
  fieldErrors: Partial<Record<ProfileField, string>>;
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  saving: boolean;
  /** Erro ao carregar ou ao salvar (fora dos campos). */
  errorMessage: string | null;
  successMessage: string | null;
  /** Dono de barbearia: mostra "Minhas barbearias"; senão, "Cadastrar minha barbearia". */
  isOwner: boolean;
};

export type PerfilActions = {
  setField: (field: ProfileField, value: string) => void;
  toggleShowCurrentPassword: () => void;
  toggleShowNewPassword: () => void;
  save: () => void;
  retry: () => void;
  openMyBarbershops: () => void;
};

const FORM_VAZIO: ProfileForm = { name: "", phone: "", currentPassword: "", newPassword: "" };

/** 11987654321 → (11) 98765-4321 */
const formatPhone = (phone: string) => {
  const d = phone.replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return phone;
};

const formDe = (user: User): ProfileForm => ({ ...FORM_VAZIO, name: user.name, phone: formatPhone(user.phone) });

const mensagem = (erro: unknown) =>
  erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.";

export function usePerfilViewModel(
  useCases: IProfileUseCases = profileUseCases,
  auth: IAuthUseCases = authUseCases,
): [PerfilState, PerfilActions] {
  const isOwner = auth.getSession()?.roles.includes("owner") ?? false;
  const [status, setStatus] = useState<PerfilStatus>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<ProfileForm>(FORM_VAZIO);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<ProfileField, string>>>({});
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const carregar = useCallback(() => {
    useCases.getProfile().then(
      (dados) => {
        setUser(dados);
        setForm(formDe(dados));
        setErrorMessage(null);
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

  const save = () => {
    if (saving) return;
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    useCases
      .saveProfile(form)
      .then(
        (salvo) => {
          setUser(salvo);
          setForm(formDe(salvo));
          setFieldErrors({});
          setSuccessMessage("Alterações salvas.");
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
      user,
      form,
      fieldErrors,
      showCurrentPassword,
      showNewPassword,
      saving,
      errorMessage,
      successMessage,
      isOwner,
    },
    {
      setField: (field, value) => {
        setForm((atual) => ({ ...atual, [field]: value }));
        setFieldErrors((atual) => ({ ...atual, [field]: undefined }));
        setSuccessMessage(null);
      },
      toggleShowCurrentPassword: () => setShowCurrentPassword((v) => !v),
      toggleShowNewPassword: () => setShowNewPassword((v) => !v),
      save,
      openMyBarbershops: () => router.push(isOwner ? "/minhas-barbearias" : "/minhas-barbearias/nova"),
      retry: () => {
        setStatus("loading");
        carregar();
      },
    },
  ];
}
