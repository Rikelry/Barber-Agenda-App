import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { barbershopUseCases } from "@/di/container";
import { DomainError } from "@/model/errors";
import type { BarberSummary, IBarbershopUseCases } from "@/usecase/iBarbershopUseCases";

export type BarbeirosStatus = "loading" | "error" | "empty" | "content";

export type BarbeirosState = {
  status: BarbeirosStatus;
  search: string;
  barbers: BarberSummary[];
  errorMessage: string | null;
};

export type BarbeirosActions = {
  setSearch: (text: string) => void;
  retry: () => void;
  openBarber: (barber: BarberSummary) => void;
};

const ATRASO_BUSCA_MS = 300;

export function useBarbeirosViewModel(
  useCases: IBarbershopUseCases = barbershopUseCases,
): [BarbeirosState, BarbeirosActions] {
  const [status, setStatus] = useState<BarbeirosStatus>("loading");
  const [search, setSearch] = useState("");
  const [barbers, setBarbers] = useState<BarberSummary[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pedido = useRef(0);

  const carregar = useCallback(
    async (termo: string) => {
      const atual = ++pedido.current;
      setStatus("loading");
      try {
        const lista = await useCases.listBarbers(termo);
        if (atual !== pedido.current) return;
        setBarbers(lista);
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
    { status, search, barbers, errorMessage },
    {
      setSearch,
      retry: () => void carregar(search),
      openBarber: ({ professional }) =>
        router.push({
          pathname: "/barbeiro/[id]",
          params: { id: professional.id, barbershopId: professional.barbershopId },
        }),
    },
  ];
}
