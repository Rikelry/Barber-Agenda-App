import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { barbershopUseCases } from "@/di/container";
import type { Barbershop } from "@/model/entities/barbershop";
import { DomainError } from "@/model/errors";
import type { IBarbershopUseCases } from "@/usecase/iBarbershopUseCases";

export type BarbeariasStatus = "loading" | "error" | "empty" | "content";

export type BarbeariasState = {
  status: BarbeariasStatus;
  search: string;
  barbershops: Barbershop[];
  errorMessage: string | null;
};

export type BarbeariasActions = {
  setSearch: (text: string) => void;
  retry: () => void;
  openBarbershop: (barbershopId: string) => void;
};

/** Espera o usuário parar de digitar antes de buscar. */
const ATRASO_BUSCA_MS = 300;

export function useBarbeariasViewModel(
  useCases: IBarbershopUseCases = barbershopUseCases,
): [BarbeariasState, BarbeariasActions] {
  const [status, setStatus] = useState<BarbeariasStatus>("loading");
  const [search, setSearch] = useState("");
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pedido = useRef(0);

  const carregar = useCallback(
    (termo: string) => {
      const atual = ++pedido.current;
      useCases.listBarbershops(termo).then(
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

  useEffect(() => {
    const id = setTimeout(() => carregar(search), search ? ATRASO_BUSCA_MS : 0);
    return () => clearTimeout(id);
  }, [search, carregar]);

  return [
    { status, search, barbershops, errorMessage },
    {
      setSearch: (texto) => {
        setSearch(texto);
        setStatus("loading");
      },
      retry: () => {
        setStatus("loading");
        carregar(search);
      },
      openBarbershop: (barbershopId) =>
        router.push({ pathname: "/barbearia/[id]", params: { id: barbershopId } }),
    },
  ];
}
