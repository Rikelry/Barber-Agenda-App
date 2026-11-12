// Estados de tela exigidos pelo harness: carregando (esqueleto), erro (com tentar de novo) e
// vazio. No estado de conteúdo não renderiza nada; a tela mostra os dados.

import { View } from "react-native";

import { Button } from "@/view/components/button";
import { Icon } from "@/view/components/icon";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { componentSizes } from "@/view/theme";

export type ScreenStatus = "loading" | "error" | "empty" | "content";

export type ScreenStateProps = {
    status: ScreenStatus;
    loadingLabel: string;
    errorMessage?: string | null;
    onRetry?: () => void;
    emptyTitle: string;
    emptyMessage?: string;
};

const LINHAS_ESQUELETO = [0, 1, 2];

export const ScreenState = ({
    status,
    loadingLabel,
    errorMessage,
    onRetry,
    emptyTitle,
    emptyMessage,
}: ScreenStateProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;

    if (status === "content") return null;

    if (status === "loading") {
        return (
            <View
                accessible
                accessibilityRole="progressbar"
                accessibilityLabel={loadingLabel}
                accessibilityState={{ busy: true }}
                style={{ gap: spacing.md }}
            >
                {LINHAS_ESQUELETO.map((i) => (
                    <View
                        key={i}
                        style={{
                            flexDirection: "row",
                            gap: spacing.lg,
                            padding: spacing.lg,
                            minHeight: componentSizes.skeleton.card,
                            borderRadius: theme.shapes.medium,
                            backgroundColor: colors.surfaceContainerLow,
                        }}
                    >
                        <View
                            style={{
                                width: componentSizes.thumbnail.card,
                                height: componentSizes.thumbnail.card,
                                borderRadius: theme.shapes.medium,
                                backgroundColor: colors.surfaceContainerHighest,
                            }}
                        />
                        <View style={{ flex: 1, gap: spacing.sm, justifyContent: "center" }}>
                            <View
                                style={{
                                    width: "70%",
                                    height: componentSizes.skeleton.line,
                                    borderRadius: theme.shapes.extraSmall,
                                    backgroundColor: colors.surfaceContainerHighest,
                                }}
                            />
                            <View
                                style={{
                                    width: "45%",
                                    height: componentSizes.skeleton.line,
                                    borderRadius: theme.shapes.extraSmall,
                                    backgroundColor: colors.surfaceContainerHighest,
                                }}
                            />
                        </View>
                    </View>
                ))}
            </View>
        );
    }

    const erro = status === "error";
    return (
        <View
            accessibilityLiveRegion="polite"
            style={{ alignItems: "center", gap: spacing.md, paddingVertical: spacing.xxxl }}
        >
            <Icon
                name={erro ? "close" : "search"}
                size={spacing.huge}
                color={erro ? colors.error : colors.onSurfaceVariant}
            />
            <Typography variant="titleMedium" align="center" color={erro ? "error" : "onSurface"}>
                {erro ? "Não foi possível carregar" : emptyTitle}
            </Typography>
            {(erro ? errorMessage : emptyMessage) ? (
                <Typography variant="bodyMedium" align="center" color="onSurfaceVariant">
                    {erro ? errorMessage : emptyMessage}
                </Typography>
            ) : null}
            {erro && onRetry ? (
                <Button variant="tonal" onPress={onRetry}>
                    Tentar de novo
                </Button>
            ) : null}
        </View>
    );
};
