// Chip de categoria do Início, no estilo das abas de filtro do WhatsApp: cápsula de 36 dp com a
// largura do texto (esticando para preencher a linha quando sobra espaço), sem ícone.
// Selecionado em marrom escuro com texto creme; os demais com fundo transparente, borda fina
// bege e texto marrom.

import { Pressable } from "react-native";

import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { componentSizes, withAlpha } from "@/view/theme";

export type CategoryChipProps = {
    label: string;
    selected: boolean;
    onPress: () => void;
};

export const CategoryChip = ({ label, selected, onPress }: CategoryChipProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;

    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={label === "Tudo" ? "Todas as categorias" : `Categoria ${label}`}
            accessibilityState={{ selected }}
            android_ripple={{ color: withAlpha(colors.primary, theme.state.pressed) }}
            hitSlop={{ top: spacing.xs, bottom: spacing.xs }}
            style={({ pressed }) => ({
                flexGrow: 1,
                height: componentSizes.home.categoryChipHeight,
                paddingHorizontal: spacing.sm + spacing.xs / 2,
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                borderRadius: theme.shapes.full,
                borderWidth: 1,
                borderColor: selected ? colors.primary : colors.outlineVariant,
                backgroundColor: selected ? colors.primary : "transparent",
                opacity: pressed ? 1 - theme.state.pressed : 1,
            })}
        >
            <Typography
                variant="labelLarge"
                numberOfLines={1}
                style={{ color: selected ? colors.background : colors.secondary }}
            >
                {label}
            </Typography>
        </Pressable>
    );
};
