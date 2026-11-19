import { router } from "expo-router";
import { useState } from "react";

import { authUseCases, imagePicker, ownerUseCases } from "@/di/container";
import { DomainError, ValidationError } from "@/model/errors";
import type { LocalFile } from "@/model/services/iApiService";
import type { IImagePickerService } from "@/model/services/iImagePickerService";
import type { IAuthUseCases, RegisterField, RegisterForm } from "@/usecase/iAuthUseCases";
import type { BarbershopField, BarbershopForm, IOwnerUseCases } from "@/usecase/iOwnerUseCases";
import { FORM_BARBEARIA_VAZIO } from "@/viewmodel/useNovaBarbeariaViewModel";

/** Canvas de telas: 1 tipo de conta, 2 dados pessoais, 3 dados da barbearia (só para quem tem uma). */
export type CadastroPasso = "tipo" | "dados" | "barbearia";
export type CadastroTipoConta = "cliente" | "dono";

export type CadastroState = {
  step: CadastroPasso;
  accountType: CadastroTipoConta;
  /** Total de passos que aparece na barra: 2 para cliente, 3 para dono. */
  totalSteps: number;
  form: RegisterForm;
  fieldErrors: Partial<Record<RegisterField, string>>;
  barbershop: BarbershopForm;
  barbershopErrors: Partial<Record<BarbershopField, string>>;
  logoUri: string | null;
  loading: boolean;
  errorMessage: string | null;
};

export type CadastroActions = {
  setAccountType: (tipo: CadastroTipoConta) => void;
  /** Passo 1 → 2. */
  next: () => void;
  setField: (field: RegisterField, value: string) => void;
  /** Passo 2: cria a conta; o cliente vai para o Início e o dono segue para a barbearia. */
  submit: () => void;
  setBarbershopField: (field: BarbershopField, value: string) => void;
  pickLogo: () => void;
  /** Passo 3: cria a barbearia e abre a Gestão. */
  submitBarbershop: () => void;
  /** Passo 3: deixa a barbearia para depois (dá para cadastrar pelo Perfil). */
  skipBarbershop: () => void;
  goBack: () => void;
};

const VAZIO: RegisterForm = { name: "", email: "", phone: "", password: "", confirmPassword: "" };

const mensagem = (erro: unknown) => (erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.");

export function useCadastroViewModel(
  auth: IAuthUseCases = authUseCases,
  owner: IOwnerUseCases = ownerUseCases,
  picker: IImagePickerService = imagePicker,
): [CadastroState, CadastroActions] {
  const [step, setStep] = useState<CadastroPasso>("tipo");
  const [accountType, setAccountType] = useState<CadastroTipoConta>("cliente");
  const [form, setForm] = useState<RegisterForm>(VAZIO);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<RegisterField, string>>>({});
  const [barbershop, setBarbershop] = useState<BarbershopForm>(FORM_BARBEARIA_VAZIO);
  const [barbershopErrors, setBarbershopErrors] = useState<Partial<Record<BarbershopField, string>>>({});
  const [logo, setLogo] = useState<LocalFile | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = () => {
    if (loading) return;
    setLoading(true);
    setErrorMessage(null);
    auth
      .register(form)
      // Conta criada e já entrou: o cliente vai para o Início sem deixar o cadastro na pilha.
      .then(
        () => (accountType === "dono" ? setStep("barbearia") : router.replace("/")),
        (erro: unknown) => {
          if (erro instanceof ValidationError) setFieldErrors(erro.fields);
          else setErrorMessage(mensagem(erro));
        },
      )
      .finally(() => setLoading(false));
  };

  const submitBarbershop = () => {
    if (loading) return;
    setLoading(true);
    setErrorMessage(null);
    owner
      .createBarbershop(barbershop, logo)
      // A primeira barbearia torna o usuário dono: atualiza os papéis antes de abrir a Gestão.
      .then(() => auth.refreshSession().catch(() => null))
      .then(
        () => router.replace("/gestao"),
        (erro: unknown) => {
          if (erro instanceof ValidationError) setBarbershopErrors(erro.fields);
          else setErrorMessage(mensagem(erro));
        },
      )
      .finally(() => setLoading(false));
  };

  return [
    {
      step,
      accountType,
      totalSteps: accountType === "dono" ? 3 : 2,
      form,
      fieldErrors,
      barbershop,
      barbershopErrors,
      logoUri: logo?.uri ?? null,
      loading,
      errorMessage,
    },
    {
      setAccountType,
      next: () => setStep("dados"),
      setField: (field, value) => {
        setForm((atual) => ({ ...atual, [field]: value }));
        setFieldErrors((atual) => ({ ...atual, [field]: undefined }));
        setErrorMessage(null);
      },
      submit,
      setBarbershopField: (field, value) => {
        setBarbershop((atual) => ({ ...atual, [field]: value }));
        setBarbershopErrors((atual) => ({ ...atual, [field]: undefined }));
      },
      pickLogo: () => {
        picker.pickImage().then((foto) => foto && setLogo(foto), () => undefined);
      },
      submitBarbershop,
      skipBarbershop: () => router.replace("/"),
      goBack: () => {
        // A conta já existe no passo 3: voltar leva ao Início, não ao formulário.
        if (step === "barbearia") router.replace("/");
        else if (step === "dados") setStep("tipo");
        else if (router.canGoBack()) router.back();
        else router.replace("/login");
      },
    },
  ];
}
