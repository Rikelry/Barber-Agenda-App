import { router, useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";

import { ownerUseCases } from "@/di/container";
import { DomainError } from "@/model/errors";
import type { IOwnerUseCases, OwnedBarbershop } from "@/usecase/iOwnerUseCases";

export type MinhasBarbeariasStatus = "loading" | "error" | "empty" | "content";

export type MinhasBarbeariasState = {
  status: MinhasBarbeariasStatus;
  search: string;
  barbershops: OwnedBarbershop[];
  errorMessage: string | null;
};

export type MinhasBarbeariasActions = {
  setSearch: (text: string) => void;
  retry: () => void;
  open: (barbershopId: string) => void;
  create: () => void;
};

const ATRASO_BUSCA_MS = 300;

export function useMinhasBarbeariasViewModel(
  useCases: IOwnerUseCases = ownerUseCases,
): [MinhasBarbeariasState, MinhasBarbeariasActions] {
  const [status, setStatus] = useState<MinhasBarbeariasStatus>("loading");
  const [search, setSearch] = useState("");
  const [barbershops, setBarbershops] = useState<OwnedBarbershop[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pedido = useRef(0);

  const carregar = useCallback(
    (termo: string) => {
      const atual = ++pedido.current;
      useCases.listMyBarbershops(termo).then(
        (lista) => {
          if (atual !== pedido.current) return;
          setBarbershops(lista);
          setErrorMessage(null);
          setStatus(lista.length === 0 ? "empty" : "content");
        },
        (erro: unknown) => {
          if (atual !== pedido.current) return;
          setErrorMessage(erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.");
          setStatus("error");
        },
      );
    },
    [useCases],
  );

  // Recarrega sempre que a tela volta a aparecer (ex.: depois de criar ou editar uma barbearia).
  const buscaAtual = useRef("");
  const atraso = useRef<ReturnType<typeof setTimeout> | null>(null);
  useFocusEffect(
    useCallback(() => {
      carregar(buscaAtual.current);
    }, [carregar]),
  );

  return [
    { status, search, barbershops, errorMessage },
    {
      setSearch: (t) => {
        setSearch(t);
        setStatus("loading");
        buscaAtual.current = t;
        if (atraso.current) clearTimeout(atraso.current);
        atraso.current = setTimeout(() => carregar(t), ATRASO_BUSCA_MS);
      },
      retry: () => {
        setStatus("loading");
        carregar(search);
      },
      open: (id) => router.push({ pathname: "/minhas-barbearias/[id]", params: { id } }),
      create: () => router.push("/minhas-barbearias/nova"),
    },
  ];
}
