// Cabeçalho do Início: fundo marrom escuro com cantos inferiores arredondados e arcos finos
// concêntricos ao fundo (SVG próprio, bege em baixa opacidade, à direita e ao centro). Nome do
// app e foto de quem entrou (a foto abre o Perfil) em cima e o campo de pesquisa de barbearias
// embaixo.

import { Image } from "expo-image";
import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Avatar } from "@/view/components/avatar";
import { SearchBar } from "@/view/components/searchBar";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { componentSizes, overlay, withAlpha } from "@/view/theme";

const ARCOS = require("@/assets/images/home/cabecalho-arcos.svg");

export type HomeHeaderProps = {
    userName: string | null;
    avatarUrl: string | null;
    onProfile: () => void;
    /** Pesquisa de barbearias por nome ou endereço. */
    search: string;
    onSearchChange: (text: string) => void;
};

export const HomeHeader = ({ userName, avatarUrl, onProfile, search, onSearchChange }: HomeHeaderProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const insets = useSafeAreaInsets();
    const ripple = { color: withAlpha(colors.onPrimary, theme.state.pressed), borderless: true };

    return (
        <View
            style={{
                backgroundColor: colors.primary,
                paddingTop: insets.top + spacing.md,
                paddingBottom: spacing.xxl,
                paddingHorizontal: spacing.lg,
                borderBottomLeftRadius: theme.shapes.extraLarge,
                borderBottomRightRadius: theme.shapes.extraLarge,
                overflow: "hidden",
                gap: spacing.xs,
            }}
        >
            {/* Decoração: fica atrás de tudo e não recebe toques nem leitura. */}
            <Image
                source={ARCOS}
                tintColor={colors.primaryContainer}
                contentFit="cover"
                contentPosition="right top"
                accessible={false}
                pointerEvents="none"
                style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: "85%",
                    opacity: overlay.headerPattern,
                }}
            />

            <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.xs }}>
                <Typography
                    variant="headlineMedium"
                    weight="700"
                    color="onPrimary"
                    accessibilityRole="header"
                    style={{ flex: 1 }}
                >
                    Barber Agenda
                </Typography>
                {userName ? (
                    <Pressable
                        onPress={onProfile}
                        accessibilityRole="button"
                        accessibilityLabel="Abrir meu perfil"
                        android_ripple={ripple}
                        style={({ pressed }) => ({
                            minWidth: componentSizes.touchTarget,
                            minHeight: componentSizes.touchTarget,
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: pressed ? 1 - theme.state.pressed : 1,
                        })}
                    >
                        <Avatar name={userName} uri={avatarUrl} />
                    </Pressable>
                ) : null}
            </View>

            <View style={{ marginTop: spacing.sm }}>
                <SearchBar
                    value={search}
                    onChangeText={onSearchChange}
                    placeholder="Buscar barbearia ou endereço"
                    accessibilityLabel="Buscar barbearias"
                />
            </View>
        </View>
    );
};
