import { router } from "expo-router";
import { useEffect, useState } from "react";

import { imagePicker, portfolioUseCases, professionalUseCases } from "@/di/container";
import type { Service } from "@/model/entities/service";
import { DomainError, ValidationError } from "@/model/errors";
import type { LocalFile } from "@/model/services/iApiService";
import type { IImagePickerService } from "@/model/services/iImagePickerService";
import type { IPortfolioUseCases, PortfolioPhotoField, PortfolioPhotoForm } from "@/usecase/iPortfolioUseCases";
import type { IProfessionalUseCases } from "@/usecase/iProfessionalUseCases";

export type NovaFotoState = {
  photoUri: string | null;
  form: PortfolioPhotoForm;
  /** Serviços da barbearia onde o profissional atende, para marcar o corte da foto. */
  services: Service[];
  fieldErrors: Partial<Record<PortfolioPhotoField, string>>;
  saving: boolean;
  errorMessage: string | null;
};

export type NovaFotoActions = {
  pickPhoto: () => void;
  setCaption: (texto: string) => void;
  toggleService: (serviceId: string) => void;
  setFeatured: (valor: boolean) => void;
  setConsent: (valor: boolean) => void;
  publish: () => void;
  goBack: () => void;
};

const FORM_VAZIO: PortfolioPhotoForm = { caption: "", serviceId: null, featured: true, consent: false };

export function useNovaFotoViewModel(
  useCases: IPortfolioUseCases = portfolioUseCases,
  profissional: IProfessionalUseCases = professionalUseCases,
  picker: IImagePickerService = imagePicker,
): [NovaFotoState, NovaFotoActions] {
  const [photo, setPhoto] = useState<LocalFile | null>(null);
  const [form, setForm] = useState<PortfolioPhotoForm>(FORM_VAZIO);
  const [services, setServices] = useState<Service[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<PortfolioPhotoField, string>>>({});
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    // Sem os serviços a foto ainda pode ser publicada: o campo só some.
    profissional.getWorkplace().then((w) => setServices(w.services), () => undefined);
  }, [profissional]);

  const pickPhoto = () => {
    picker.pickImage().then(
      (foto) => {
        if (!foto) return;
        setPhoto(foto);
        setFieldErrors((e) => ({ ...e, photo: undefined }));
      },
      () => setErrorMessage("Não foi possível abrir a galeria."),
    );
  };

  const publish = () => {
    if (saving) return;
    setSaving(true);
    setErrorMessage(null);
    useCases
      .publish(form, photo)
      .then(
        () => (router.canGoBack() ? router.back() : router.replace("/portfolio")),
        (erro: unknown) => {
          if (erro instanceof ValidationError) setFieldErrors(erro.fields);
          else setErrorMessage(erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.");
        },
      )
      .finally(() => setSaving(false));
  };

  return [
    { photoUri: photo?.uri ?? null, form, services, fieldErrors, saving, errorMessage },
    {
      pickPhoto,
      setCaption: (texto) => {
        setForm((f) => ({ ...f, caption: texto }));
        setFieldErrors((e) => ({ ...e, caption: undefined }));
      },
      toggleService: (id) => setForm((f) => ({ ...f, serviceId: f.serviceId === id ? null : id })),
      setFeatured: (valor) => setForm((f) => ({ ...f, featured: valor })),
      setConsent: (valor) => {
        setForm((f) => ({ ...f, consent: valor }));
        setFieldErrors((e) => ({ ...e, consent: undefined }));
      },
      publish,
      goBack: () => (router.canGoBack() ? router.back() : router.replace("/portfolio")),
    },
  ];
}
