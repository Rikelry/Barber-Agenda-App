import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { Linking } from "react-native";

import { barbershopUseCases } from "@/di/container";
import type { Professional } from "@/model/entities/professional";
import { DomainError } from "@/model/errors";
import type { BarbershopDetail, IBarbershopUseCases } from "@/usecase/iBarbershopUseCases";

export type DetalheBarbeariaStatus = "loading" | "error" | "content";

export type DetalheBarbeariaState = {
  status: DetalheBarbeariaStatus;
  detail: BarbershopDetail | null;
  errorMessage: string | null;
};

export type DetalheBarbeariaActions = {
  retry: () => void;
  openBarber: (professional: Professional) => void;
  callBarbershop: () => void;
};

export function useDetalheBarbeariaViewModel(
  useCases: IBarbershopUseCases = barbershopUseCases,
): [DetalheBarbeariaState, DetalheBarbeariaActions] {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [status, setStatus] = useState<DetalheBarbeariaStatus>("loading");
  const [detail, setDetail] = useState<BarbershopDetail | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pedido = useRef(0);

  const carregar = useCallback(() => {
    const atual = ++pedido.current;
    useCases.getBarbershopDetail(id).then(
      (dados) => {
        if (atual !== pedido.current) return;
        setDetail(dados);
        setErrorMessage(null);
        setStatus("content");
      },
      (erro: unknown) => {
        if (atual !== pedido.current) return;
        setErrorMessage(erro instanceof DomainError ? erro.message : "Erro inesperado. Tente de novo.");
        setStatus("error");
      },
    );
  }, [id, useCases]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return [
    { status, detail, errorMessage },
    {
      retry: () => {
        setStatus("loading");
        carregar();
      },
      openBarber: (professional) =>
        router.push({
          pathname: "/barbeiro/[id]",
          params: { id: professional.id, barbershopId: professional.barbershopId },
        }),
      callBarbershop: () => {
        const telefone = detail?.barbershop.phone.replace(/[^\d+]/g, "");
        if (telefone) void Linking.openURL(`tel:${telefone}`);
      },
    },
  ];
}
