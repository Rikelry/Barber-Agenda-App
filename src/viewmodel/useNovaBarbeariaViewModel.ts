import { router } from "expo-router";
import { useState } from "react";

import { authUseCases, imagePicker, ownerUseCases } from "@/di/container";
import { DomainError, ValidationError } from "@/model/errors";
import type { LocalFile } from "@/model/services/iApiService";
import type { IImagePickerService } from "@/model/services/iImagePickerService";
import type { IAuthUseCases } from "@/usecase/iAuthUseCases";
import type { BarbershopField, BarbershopForm, IOwnerUseCases } from "@/usecase/iOwnerUseCases";

export type NovaBarbeariaState = {
  form: BarbershopForm;
  fieldErrors: Partial<Record<BarbershopField, string>>;
  logoUri: string | null;
  saving: boolean;
  errorMessage: string | null;
};

export type NovaBarbeariaActions = {
  setField: (field: BarbershopField, value: string) => void;
  pickLogo: () => void;
  submit: () => void;
  goBack: () => void;
};

export const FORM_BARBEARIA_VAZIO: BarbershopForm = {
  name: "",
  phone: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
};

export function useNovaBarbeariaViewModel(
  useCases: IOwnerUseCases = ownerUseCases,
  auth: IAuthUseCases = authUseCases,
  picker: IImagePickerService = imagePicker,
): [NovaBarbeariaState, NovaBarbeariaActions] {
  const [form, setForm] = useState<BarbershopForm>(FORM_BARBEARIA_VAZIO);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<BarbershopField, string>>>({});
  const [logo, setLogo] = useState<LocalFile | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = () => {
    if (saving) return;
    setSaving(true);
    setErrorMessage(null);
    useCases
      .createBarbershop(form, logo)
      // Criar a primeira barbearia torna o usuário dono: atualiza os papéis da sessão.
      .then(() => auth.refreshSession().catch(() => null))
      .then(
        () => router.dismissTo("/minhas-barbearias"),
        (erro: unknown) => {
          if (erro instanceof ValidationError) setFieldErrors(erro.fields);
          else setErrorMessage(erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.");
        },
      )
      .finally(() => setSaving(false));
  };

  return [
    { form, fieldErrors, logoUri: logo?.uri ?? null, saving, errorMessage },
    {
      setField: (field, value) => {
        setForm((f) => ({ ...f, [field]: value }));
        setFieldErrors((e) => ({ ...e, [field]: undefined }));
      },
      pickLogo: () => {
        picker.pickImage().then((foto) => foto && setLogo(foto), () => undefined);
      },
      submit,
      goBack: () => (router.canGoBack() ? router.back() : router.replace("/minhas-barbearias")),
    },
  ];
}
