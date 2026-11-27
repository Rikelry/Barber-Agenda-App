import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { authUseCases, ownerUseCases, profileUseCases } from "@/di/container";
import type { Barbershop } from "@/model/entities/barbershop";
import type { UserRole } from "@/model/entities/session";
import type { User } from "@/model/entities/user";
import { DomainError, ValidationError } from "@/model/errors";
import type { IAuthUseCases } from "@/usecase/iAuthUseCases";
import type { IOwnerUseCases } from "@/usecase/iOwnerUseCases";
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
  /** Papéis reais da sessão (Cliente, Profissional, Dono): decidem as seções e as etiquetas. */
  roles: UserRole[];
  /** Dono: mostra MINHA BARBEARIA; quem não é dono vê só o convite "Cadastrar minha barbearia". */
  isOwner: boolean;
  /** Profissional de alguma barbearia: mostra TRABALHO (a agenda é a aba Trabalho). */
  isProfessional: boolean;
  /** Barbearia do dono mostrada em MINHA BARBEARIA (a primeira, em ordem alfabética). */
  barbershop: Barbershop | null;
  /** Quantas outras barbearias o dono tem (a agenda delas fica na aba Trabalho). */
  otherBarbershops: number;
  /** Confirmação de "Sair da conta" aberta. */
  confirmingLogout: boolean;
};

export type PerfilActions = {
  setField: (field: ProfileField, value: string) => void;
  toggleShowCurrentPassword: () => void;
  toggleShowNewPassword: () => void;
  save: () => void;
  retry: () => void;
  registerBarbershop: () => void;
  openPersonalData: () => void;
  goBack: () => void;
  openWorkplace: () => void;
  openPortfolio: () => void;
  /** Informações da barbearia (nome, telefone, endereço e foto). */
  openBarbershop: () => void;
  openHours: () => void;
  openProfessionals: () => void;
  openServices: () => void;
  askLogout: () => void;
  dismissLogout: () => void;
  /** Sai da conta e volta para o login. */
  logout: () => void;
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
  owner: IOwnerUseCases = ownerUseCases,
): [PerfilState, PerfilActions] {
  const [roles, setRoles] = useState<UserRole[]>(() => [...(auth.getSession()?.roles ?? [])]);
  const isOwner = roles.includes("owner");
  const isProfessional = roles.includes("profissional");
  const [barbershop, setBarbershop] = useState<Barbershop | null>(null);
  const [otherBarbershops, setOtherBarbershops] = useState(0);
  const [confirmingLogout, setConfirmingLogout] = useState(false);
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
    // Papéis podem mudar enquanto o app está aberto (ex.: o dono passou a atender).
    const papeis = auth.getSession()?.roles ?? [];
    setRoles((antes) => (antes.join() === papeis.join() ? antes : [...papeis]));
    if (papeis.includes("owner")) {
      // A barbearia é um extra do Perfil: se falhar, a seção mostra só os módulos sem o cartão.
      owner.listMyBarbershops().then(
        (minhas) => {
          setBarbershop(minhas[0]?.barbershop ?? null);
          setOtherBarbershops(Math.max(0, minhas.length - 1));
        },
        () => setBarbershop(null),
      );
    }
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
  }, [useCases, auth, owner]);

  // Recarrega ao voltar para a tela: o menu do Perfil mostra o nome salvo em Dados pessoais.
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

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
      roles,
      isOwner,
      isProfessional,
      barbershop,
      otherBarbershops,
      confirmingLogout,
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
      openWorkplace: () => router.push("/meu-trabalho"),
      openPortfolio: () => router.push("/portfolio"),
      registerBarbershop: () => router.push("/minhas-barbearias/nova"),
      openPersonalData: () => router.push("/perfil/dados"),
      openBarbershop: () => {
        if (barbershop) router.push({ pathname: "/minhas-barbearias/[id]", params: { id: barbershop.id } });
      },
      openHours: () => {
        if (barbershop) router.push({ pathname: "/minhas-barbearias/[id]/horarios", params: { id: barbershop.id } });
      },
      openProfessionals: () => {
        if (barbershop) router.push({ pathname: "/minhas-barbearias/[id]/profissionais", params: { id: barbershop.id } });
      },
      openServices: () => {
        if (barbershop) router.push({ pathname: "/minhas-barbearias/[id]/servicos", params: { id: barbershop.id } });
      },
      askLogout: () => setConfirmingLogout(true),
      dismissLogout: () => setConfirmingLogout(false),
      goBack: () => (router.canGoBack() ? router.back() : router.replace("/perfil")),
      logout: () => {
        auth.logout();
        router.replace("/login");
      },
      retry: () => {
        setStatus("loading");
        carregar();
      },
    },
  ];
}
