// Barra de passos de um fluxo (canvas de telas): "Passo 1 de 2" e um traço por passo.

import { View } from "react-native";

import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";

export type StepProgressProps = { current: number; total: number };

export const StepProgress = ({ current, total }: StepProgressProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    return (
        <View
            accessible
            accessibilityRole="progressbar"
            accessibilityLabel={`Passo ${current} de ${total}`}
            accessibilityValue={{ min: 1, max: total, now: current }}
            style={{ gap: spacing.xs, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm }}
        >
            <Typography variant="bodySmall" color="onSurfaceVariant">
                Passo {current} de {total}
            </Typography>
            <View style={{ flexDirection: "row", gap: spacing.xs }}>
                {Array.from({ length: total }, (_, i) => (
                    <View
                        key={i}
                        style={{
                            flex: 1,
                            height: componentSizes.progress.height,
                            borderRadius: theme.shapes.extraSmall,
                            backgroundColor: i < current ? colors.primary : colors.surfaceDim,
                        }}
                    />
                ))}
            </View>
        </View>
    );
};
