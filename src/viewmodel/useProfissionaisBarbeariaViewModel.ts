import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import { authUseCases, ownerUseCases } from "@/di/container";
import type { Professional } from "@/model/entities/professional";
import { DomainError, ValidationError } from "@/model/errors";
import type { IAuthUseCases } from "@/usecase/iAuthUseCases";
import type { IOwnerUseCases, ProfessionalField, ProfessionalForm } from "@/usecase/iOwnerUseCases";

export type ProfissionaisBarbeariaStatus = "loading" | "error" | "content";

export type ProfissionaisBarbeariaState = {
  status: ProfissionaisBarbeariaStatus;
  professionals: Professional[];
  /** Formulário aberto: null fechado, "novo" para cadastrar ou o id em edição. */
  editing: string | null;
  form: ProfessionalForm;
  fieldErrors: Partial<Record<ProfessionalField, string>>;
  saving: boolean;
  /** Profissional com a confirmação de remover aberta. */
  confirmingRemoveId: string | null;
  /** O dono ainda não atende: mostra "Eu também atendo aqui". */
  canJoin: boolean;
  joining: boolean;
  /** Aviso depois de o dono passar a atender (ou o erro ao tentar). */
  joinMessage: string | null;
  errorMessage: string | null;
};

export type ProfissionaisBarbeariaActions = {
  /** O dono passa a atender nesta barbearia e ganha a própria agenda. */
  joinAsProfessional: () => void;
  openMyAgenda: () => void;
  openNew: () => void;
  openEdit: (professional: Professional) => void;
  closeForm: () => void;
  setField: (field: ProfessionalField, value: string) => void;
  submit: () => void;
  askRemove: (professionalId: string) => void;
  dismissRemove: () => void;
  confirmRemove: () => void;
  retry: () => void;
  goBack: () => void;
};

const VAZIO: ProfessionalForm = { name: "", phone: "", email: "", password: "", specialty: "" };

const mensagem = (erro: unknown) =>
  erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.";

export function useProfissionaisBarbeariaViewModel(
  useCases: IOwnerUseCases = ownerUseCases,
  auth: IAuthUseCases = authUseCases,
): [ProfissionaisBarbeariaState, ProfissionaisBarbeariaActions] {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [status, setStatus] = useState<ProfissionaisBarbeariaStatus>("loading");
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<ProfessionalForm>(VAZIO);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<ProfessionalField, string>>>({});
  const [saving, setSaving] = useState(false);
  const [confirmingRemoveId, setConfirmingRemoveId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [canJoin, setCanJoin] = useState(() => useCases.canJoinAsProfessional());
  const [joining, setJoining] = useState(false);
  const [joinMessage, setJoinMessage] = useState<string | null>(null);

  const carregar = useCallback(() => {
    useCases.listProfessionals(id).then(
      (lista) => {
        setProfessionals(lista);
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

  const abrir = (alvo: string, dados: ProfessionalForm) => {
    setEditing(alvo);
    setForm(dados);
    setFieldErrors({});
    setErrorMessage(null);
  };

  const submit = () => {
    if (saving || !editing) return;
    setSaving(true);
    setErrorMessage(null);
    const pedido =
      editing === "novo" ? useCases.addProfessional(id, form) : useCases.updateProfessional(id, editing, form);
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
    { status, professionals, editing, form, fieldErrors, saving, confirmingRemoveId, canJoin, joining, joinMessage, errorMessage },
    {
      joinAsProfessional: () => {
        if (joining) return;
        setJoining(true);
        setJoinMessage(null);
        useCases
          .joinAsProfessional(id)
          // Novo token com o papel de profissional: a aba Trabalho aparece.
          .then(() => auth.refreshSession().catch(() => null))
          .then(
            () => {
              setCanJoin(useCases.canJoinAsProfessional());
              setJoinMessage("Pronto! Você agora atende aqui. Seus pedidos e horários ficam na aba Trabalho.");
              carregar();
            },
            (erro: unknown) => setJoinMessage(mensagem(erro)),
          )
          .finally(() => setJoining(false));
      },
      // Os pedidos do dono que atende aparecem na agenda da barbearia (aba Trabalho).
      openMyAgenda: () => router.navigate("/gestao"),
      openNew: () => abrir("novo", VAZIO),
      openEdit: (p) =>
        abrir(p.id, { name: p.name, phone: p.phone, email: p.email, password: "", specialty: p.specialty ?? "" }),
      closeForm: () => setEditing(null),
      setField: (field, value) => {
        setForm((f) => ({ ...f, [field]: value }));
        setFieldErrors((e) => ({ ...e, [field]: undefined }));
      },
      submit,
      askRemove: (pid) => {
        setErrorMessage(null);
        setConfirmingRemoveId(pid);
      },
      dismissRemove: () => setConfirmingRemoveId(null),
      confirmRemove: () => {
        if (!confirmingRemoveId || saving) return;
        setSaving(true);
        useCases
          .removeProfessional(id, confirmingRemoveId)
          .then(
            () => {
              setConfirmingRemoveId(null);
              carregar();
            },
            (erro: unknown) => setErrorMessage(mensagem(erro)),
          )
          .finally(() => setSaving(false));
      },
      retry: () => {
        setStatus("loading");
        carregar();
      },
      goBack: () => (router.canGoBack() ? router.back() : router.replace("/gestao")),
    },
  ];
}
