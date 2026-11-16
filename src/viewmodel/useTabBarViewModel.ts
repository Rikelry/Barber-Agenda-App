import { router } from "expo-router";

/** As quatro áreas do app na barra inferior (tab-bar.md). */
export type MainTab = "inicio" | "buscar" | "agendas" | "perfil";

export type TabBarState = { active: MainTab };

export type TabBarActions = { navigate: (tab: MainTab) => void };

const ROTAS = {
  inicio: "/",
  buscar: "/barbearias",
  agendas: "/agendamentos",
  perfil: "/perfil",
} as const;

export function useTabBarViewModel(active: MainTab): [TabBarState, TabBarActions] {
  return [
    { active },
    {
      // dismissTo volta para a aba se ela já está na pilha; senão a abre no lugar da atual,
      // então trocar de aba não empilha telas.
      navigate: (tab) => {
        if (tab !== active) router.dismissTo(ROTAS[tab]);
      },
    },
  ];
}
