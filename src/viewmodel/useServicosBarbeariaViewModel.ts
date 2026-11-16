import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { imagePicker, ownerUseCases } from "@/di/container";
import type { Service } from "@/model/entities/service";
import { DomainError, ValidationError } from "@/model/errors";
import type { LocalFile } from "@/model/services/iApiService";
import type { IImagePickerService } from "@/model/services/iImagePickerService";
import type { IOwnerUseCases, ServiceField, ServiceForm } from "@/usecase/iOwnerUseCases";

export type ServicosBarbeariaStatus = "loading" | "error" | "content";

export type ServicosBarbeariaState = {
  status: ServicosBarbeariaStatus;
  services: Service[];
  /** Formulário aberto: null fechado, "novo" para cadastrar ou o id em edição. */
  editing: string | null;
  form: ServiceForm;
  fieldErrors: Partial<Record<ServiceField, string>>;
  /** Foto escolhida agora ou a que o serviço já tem. */
  photoUri: string | null;
  saving: boolean;
  errorMessage: string | null;
};

export type ServicosBarbeariaActions = {
  openNew: () => void;
  openEdit: (service: Service) => void;
  closeForm: () => void;
  setField: (field: ServiceField, value: string) => void;
  pickPhoto: () => void;
  submit: () => void;
  retry: () => void;
  goBack: () => void;
};

const VAZIO: ServiceForm = { name: "", description: "", durationMinutes: "", price: "" };

const mensagem = (erro: unknown) =>
  erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.";

export function useServicosBarbeariaViewModel(
  useCases: IOwnerUseCases = ownerUseCases,
  picker: IImagePickerService = imagePicker,
): [ServicosBarbeariaState, ServicosBarbeariaActions] {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [status, setStatus] = useState<ServicosBarbeariaStatus>("loading");
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<ServiceForm>(VAZIO);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<ServiceField, string>>>({});
  const [photo, setPhoto] = useState<LocalFile | null>(null);
  const [fotoAtual, setFotoAtual] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const carregar = useCallback(() => {
    useCases.listServices(id).then(
      (lista) => {
        setServices([...lista].sort((a, b) => a.price - b.price));
        setStatus("content");
      },
      (erro: unknown) => {
        setErrorMessage(mensagem(erro));
        setStatus("error");
      },
    );
  }, [id, useCases]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const abrir = (alvo: string, dados: ServiceForm, foto: string | null = null) => {
    setEditing(alvo);
    setPhoto(null);
    setFotoAtual(foto);
    setForm(dados);
    setFieldErrors({});
    setErrorMessage(null);
  };

  const submit = () => {
    if (saving || !editing) return;
    setSaving(true);
    setErrorMessage(null);
    const pedido =
      editing === "novo" ? useCases.addService(id, form, photo) : useCases.updateService(id, editing, form, photo);
    pedido
      .then(
        () => {
          setEditing(null);
          setForm(VAZIO);
          carregar();
        },
        (erro: unknown) => {
          if (erro instanceof ValidationError) setFieldErrors(erro.fields);
          else setErrorMessage(mensagem(erro));
        },
      )
      .finally(() => setSaving(false));
  };

  return [
    { status, services, editing, form, fieldErrors, photoUri: photo?.uri ?? fotoAtual, saving, errorMessage },
    {
      openNew: () => abrir("novo", VAZIO),
      openEdit: (s) =>
        abrir(s.id, {
          name: s.name,
          description: s.description ?? "",
          durationMinutes: String(s.durationMinutes),
          price: s.price.toFixed(2).replace(".", ","),
        }, s.imageUrl),
      closeForm: () => setEditing(null),
      pickPhoto: () => {
        picker.pickImage().then((foto) => foto && setPhoto(foto), () => undefined);
      },
      setField: (field, value) => {
        setForm((f) => ({ ...f, [field]: value }));
        setFieldErrors((e) => ({ ...e, [field]: undefined }));
      },
      submit,
      retry: () => {
        setStatus("loading");
        carregar();
      },
      goBack: () => (router.canGoBack() ? router.back() : router.replace("/minhas-barbearias")),
    },
  ];
}
