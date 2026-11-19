// Barra inferior das áreas do app. As abas visíveis dependem do papel de quem entrou
// (cliente, profissional, dono) e vêm da ViewModel; aqui só há o rótulo e o ícone de cada uma.

import { TabBar } from "@/view/components/tabBar";

export type MainTabKey = "inicio" | "buscar" | "agendas" | "agenda" | "gestao" | "perfil";

export type MainTabBarProps = {
    active: MainTabKey;
    tabs: MainTabKey[];
    onNavigate: (tab: MainTabKey) => void;
};

const ABAS: Record<MainTabKey, { label: string; icon: string }> = {
    inicio: { label: "Início", icon: "home" },
    buscar: { label: "Buscar", icon: "search" },
    agendas: { label: "Agendas", icon: "calendar" },
    agenda: { label: "Trabalho", icon: "clock" },
    gestao: { label: "Gestão", icon: "gear" },
    perfil: { label: "Perfil", icon: "person" },
};

export const MainTabBar = ({ active, tabs, onNavigate }: MainTabBarProps) => (
    <TabBar
        items={tabs.map((key) => ({
            key,
            ...ABAS[key],
            selected: key === active,
            onPress: () => onNavigate(key),
        }))}
    />
);
