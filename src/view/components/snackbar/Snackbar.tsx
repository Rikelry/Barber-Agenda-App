// Snackbar do Material 3 (snackbar.md): mensagem curta sobre a tela, em inverseSurface, que some
// sozinha depois de alguns segundos sem empurrar o conteúdo. Fica logo acima da barra de abas.

import { useEffect } from "react";
import { View } from "react-native";

import { Icon } from "@/view/components/icon";
import { IconButton } from "@/view/components/iconButton";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";

/** Tempo na tela (M3: 4 a 10 s). */
const DURACAO_MS = 4000;

export type SnackbarProps = {
    message: string | null;
    onDismiss: () => void;
    /** Distância da base da tela (ex.: a altura da barra de abas). */
    bottomOffset?: number;
};

export const Snackbar = ({ message, onDismiss, bottomOffset = 0 }: SnackbarProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;

    useEffect(() => {
        if (!message) return;
        const timer = setTimeout(onDismiss, DURACAO_MS);
        return () => clearTimeout(timer);
    }, [message, onDismiss]);

    if (!message) return null;
    return (
        <View
            pointerEvents="box-none"
            style={{
                position: "absolute",
                left: spacing.lg,
                right: spacing.lg,
                bottom: bottomOffset + spacing.sm,
            }}
        >
            <View
                accessibilityLiveRegion="polite"
                accessibilityRole="alert"
                style={[
                    {
                        flexDirection: "row",
                        alignItems: "center",
                        minHeight: componentSizes.touchTarget,
                        paddingLeft: spacing.lg,
                        paddingRight: spacing.xs,
                        borderRadius: theme.shapes.extraSmall,
                        backgroundColor: colors.inverseSurface,
                    },
                    theme.getElevationStyle("level3", colors.shadow),
                ]}
            >
                <Typography
                    variant="bodyMedium"
                    style={{
                        flex: 1,
                        color: colors.inverseOnSurface,
                        paddingVertical: spacing.md,
                    }}
                >
                    {message}
                </Typography>
                <IconButton
                    accessibilityLabel="Fechar aviso"
                    onPress={onDismiss}
                    icon={() => <Icon name="close" size={spacing.xl} color={colors.inverseOnSurface} />}
                />
            </View>
        </View>
    );
};
