import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import { authUseCases } from "@/di/container";
import type { UserRole } from "@/model/entities/session";
import type { IAuthUseCases } from "@/usecase/iAuthUseCases";

/** Áreas do app na barra inferior (tab-bar.md). Agenda e Gestão só aparecem para quem tem o papel. */
export type MainTab = "inicio" | "buscar" | "agendas" | "agenda" | "gestao" | "perfil";

export type TabBarState = { active: MainTab; tabs: MainTab[] };

export type TabBarActions = { navigate: (tab: MainTab) => void };

const ROTAS = {
  inicio: "/",
  buscar: "/barbearias",
  agendas: "/agendamentos",
  agenda: "/agenda",
  gestao: "/gestao",
  perfil: "/perfil",
} as const;

/**
 * Abas por papel, no máximo 5 (tab-bar.md). Quem é profissional e dono ao mesmo tempo perde a
 * aba Buscar: a busca continua pela barra de busca do Início (padrão 9 de 05-padroes.md).
 */
export const abasDoPapel = (roles: UserRole[]): MainTab[] => {
  const profissional = roles.includes("profissional");
  const dono = roles.includes("owner");
  const abas: MainTab[] = ["inicio"];
  if (!(profissional && dono)) abas.push("buscar");
  abas.push("agendas");
  if (profissional) abas.push("agenda");
  if (dono) abas.push("gestao");
  abas.push("perfil");
  return abas;
};

export function useTabBarViewModel(
  active: MainTab,
  auth: IAuthUseCases = authUseCases,
): [TabBarState, TabBarActions] {
  const papeis = useCallback(() => auth.getSession()?.roles ?? [], [auth]);
  const [roles, setRoles] = useState<UserRole[]>(papeis);
  // As telas das abas continuam montadas: relê os papéis ao voltar a cada uma (ex.: virou dono).
  useFocusEffect(
    useCallback(() => {
      const atuais = papeis();
      // Só troca se os papéis mudaram, para não renderizar de novo à toa.
      setRoles((antes) => (antes.join() === atuais.join() ? antes : atuais));
    }, [papeis]),
  );

  return [
    { active, tabs: abasDoPapel(roles) },
    {
      // As abas vivem num navegador Tabs: navigate troca de aba sem empilhar telas.
      navigate: (tab) => {
        if (tab !== active) router.navigate(ROTAS[tab]);
      },
    },
  ];
}
