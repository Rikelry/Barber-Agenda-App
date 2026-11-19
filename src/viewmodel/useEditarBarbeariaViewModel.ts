import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { imagePicker, ownerUseCases } from "@/di/container";
import { DomainError, ValidationError } from "@/model/errors";
import type { LocalFile } from "@/model/services/iApiService";
import type { IImagePickerService } from "@/model/services/iImagePickerService";
import type { BarbershopField, BarbershopForm, IOwnerUseCases } from "@/usecase/iOwnerUseCases";
import { FORM_BARBEARIA_VAZIO } from "@/viewmodel/useNovaBarbeariaViewModel";

export type EditarBarbeariaStatus = "loading" | "error" | "content";

export type EditarBarbeariaState = {
  status: EditarBarbeariaStatus;
  form: BarbershopForm;
  fieldErrors: Partial<Record<BarbershopField, string>>;
  logoUri: string | null;
  saving: boolean;
  successMessage: string | null;
  errorMessage: string | null;
};

export type EditarBarbeariaActions = {
  setField: (field: BarbershopField, value: string) => void;
  pickLogo: () => void;
  save: () => void;
  retry: () => void;
  goBack: () => void;
  openHours: () => void;
  openProfessionals: () => void;
  openServices: () => void;
};

/** 11955554444 → (11) 95555-4444 */
const formatarTelefone = (telefone: string) => {
  const d = telefone.replace(/\D/g, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return telefone;
};

export function useEditarBarbeariaViewModel(
  useCases: IOwnerUseCases = ownerUseCases,
  picker: IImagePickerService = imagePicker,
): [EditarBarbeariaState, EditarBarbeariaActions] {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [status, setStatus] = useState<EditarBarbeariaStatus>("loading");
  const [form, setForm] = useState<BarbershopForm>(FORM_BARBEARIA_VAZIO);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<BarbershopField, string>>>({});
  const [fotoAtual, setFotoAtual] = useState<string | null>(null);
  const [logo, setLogo] = useState<LocalFile | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const carregar = useCallback(() => {
    useCases.getBarbershopForm(id).then(
      ({ barbershop, form: dados }) => {
        setForm({ ...dados, phone: formatarTelefone(dados.phone) });
        setFotoAtual(barbershop.avatarUrl);
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

  const save = () => {
    if (saving) return;
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    useCases
      .updateBarbershop(id, form, logo)
      .then(
        (salva) => {
          setFotoAtual(salva.avatarUrl);
          setLogo(null);
          setFieldErrors({});
          setSuccessMessage("Alterações salvas.");
        },
        (erro: unknown) => {
          if (erro instanceof ValidationError) setFieldErrors(erro.fields);
          else setErrorMessage(erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.");
        },
      )
      .finally(() => setSaving(false));
  };

  const abrir = (tela: "horarios" | "profissionais" | "servicos") =>
    router.push({ pathname: `/minhas-barbearias/[id]/${tela}`, params: { id } });

  return [
    { status, form, fieldErrors, logoUri: logo?.uri ?? fotoAtual, saving, successMessage, errorMessage },
    {
      setField: (field, value) => {
        setForm((f) => ({ ...f, [field]: value }));
        setFieldErrors((e) => ({ ...e, [field]: undefined }));
        setSuccessMessage(null);
      },
      pickLogo: () => {
        picker.pickImage().then((foto) => foto && setLogo(foto), () => undefined);
      },
      save,
      retry: () => {
        setStatus("loading");
        carregar();
      },
      goBack: () => (router.canGoBack() ? router.back() : router.replace("/gestao")),
      openHours: () => abrir("horarios"),
      openProfessionals: () => abrir("profissionais"),
      openServices: () => abrir("servicos"),
    },
  ];
}
