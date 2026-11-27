// Título de seção do Início com a ação "Ver todas →" alinhada à direita.

import { Pressable, View } from "react-native";

import { Icon } from "@/view/components/icon";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { componentSizes, withAlpha } from "@/view/theme";

export type SectionHeaderProps = {
    title: string;
    /** Sem onSeeAll a ação não aparece. */
    onSeeAll?: () => void;
    /** Para o leitor de tela, ex.: "Ver todas as barbearias". */
    seeAllLabel?: string;
    /** Texto da ação; padrão "Ver todas". */
    seeAllText?: string;
};

export const SectionHeader = ({ title, onSeeAll, seeAllLabel, seeAllText = "Ver todas" }: SectionHeaderProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;

    return (
        <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: spacing.lg, gap: spacing.sm }}>
            <Typography variant="titleLarge" weight="700" accessibilityRole="header" style={{ flex: 1 }}>
                {title}
            </Typography>
            {onSeeAll ? (
                <Pressable
                    onPress={onSeeAll}
                    accessibilityRole="button"
                    accessibilityLabel={seeAllLabel ?? seeAllText}
                    android_ripple={{ color: withAlpha(colors.secondary, theme.state.pressed) }}
                    style={({ pressed }) => ({
                        minHeight: componentSizes.touchTarget,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: spacing.xs,
                        paddingHorizontal: spacing.xs,
                        borderRadius: theme.shapes.small,
                        opacity: pressed ? 1 - theme.state.pressed : 1,
                    })}
                >
                    <Typography variant="labelLarge" color="secondary">
                        {seeAllText}
                    </Typography>
                    <Icon name="arrowForward" size={spacing.lg + spacing.xs} color={colors.secondary} />
                </Pressable>
            ) : null}
        </View>
    );
};
