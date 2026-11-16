// Barra inferior das quatro áreas do app: Início, Buscar, Agendas e Perfil.

import { TabBar } from "@/view/components/tabBar";

export type MainTabKey = "inicio" | "buscar" | "agendas" | "perfil";

export type MainTabBarProps = {
    active: MainTabKey;
    onNavigate: (tab: MainTabKey) => void;
};

const ABAS: { key: MainTabKey; label: string; icon: string }[] = [
    { key: "inicio", label: "Início", icon: "⌂" },
    { key: "buscar", label: "Buscar", icon: "search" },
    { key: "agendas", label: "Agendas", icon: "calendar" },
    { key: "perfil", label: "Perfil", icon: "person" },
];

export const MainTabBar = ({ active, onNavigate }: MainTabBarProps) => (
    <TabBar
        items={ABAS.map((aba) => ({
            ...aba,
            selected: aba.key === active,
            onPress: () => onNavigate(aba.key),
        }))}
    />
);
