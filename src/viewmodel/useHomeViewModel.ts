import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { barbershopUseCases } from "@/di/container";
import type { Barbershop } from "@/model/entities/barbershop";
import { DomainError } from "@/model/errors";
import type { IBarbershopUseCases } from "@/usecase/iBarbershopUseCases";

export type HomeStatus = "loading" | "error" | "empty" | "content";

export type HomeState = {
  status: HomeStatus;
  search: string;
  barbershops: Barbershop[];
  errorMessage: string | null;
};

export type HomeActions = {
  setSearch: (text: string) => void;
  retry: () => void;
  openBarbershop: (barbershopId: string) => void;
  openBarbers: () => void;
};

/** Espera o usuário parar de digitar antes de buscar. */
const ATRASO_BUSCA_MS = 300;

export function useHomeViewModel(
  useCases: IBarbershopUseCases = barbershopUseCases,
): [HomeState, HomeActions] {
  const [status, setStatus] = useState<HomeStatus>("loading");
  const [search, setSearch] = useState("");
  const [barbershops, setBarbershops] = useState<Barbershop[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pedido = useRef(0);

  const carregar = useCallback(
    async (termo: string) => {
      const atual = ++pedido.current;
      setStatus("loading");
      try {
        const lista = await useCases.listBarbershops(termo);
        if (atual !== pedido.current) return;
        setBarbershops(lista);
        setErrorMessage(null);
        setStatus(lista.length === 0 ? "empty" : "content");
      } catch (erro: unknown) {
        if (atual !== pedido.current) return;
        setErrorMessage(erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.");
        setStatus("error");
      }
    },
    [useCases],
  );

  useEffect(() => {
    const id = setTimeout(() => void carregar(search), search ? ATRASO_BUSCA_MS : 0);
    return () => clearTimeout(id);
  }, [search, carregar]);

  return [
    { status, search, barbershops, errorMessage },
    {
      setSearch,
      retry: () => void carregar(search),
      openBarbershop: (barbershopId) =>
        router.push({ pathname: "/barbearia/[id]", params: { id: barbershopId } }),
      openBarbers: () => router.push("/barbeiros"),
    },
  ];
}
