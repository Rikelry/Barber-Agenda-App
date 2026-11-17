import type { ViewStyle } from "react-native";
import type { DesignTheme } from "@/view/theme";
import type { CardVariant } from "@/view/components/card/Card.types";
import { hexToRgba } from "@/view/theme";

export type CardStyleOptions = {
    theme: DesignTheme;
    variant: CardVariant;
    disabled?: boolean;
};

export function getCardColors({ theme, variant, disabled = false }: CardStyleOptions) {
    const { colors, state } = theme;

    if (disabled) {
        return {
            backgroundColor: hexToRgba(colors.surfaceContainer, state.disabledContainer),
            borderColor: variant === "outlined" ? hexToRgba(colors.outline, state.disabledContainer) : "transparent",
            rippleColor: "transparent",
        };
    }

    switch (variant) {
        case "elevated":
            return {
                backgroundColor: colors.surfaceContainerLow,
                borderColor: "transparent",
                rippleColor: hexToRgba(colors.onSurface, state.pressed),
            };
        case "filled":
            return {
                backgroundColor: colors.surfaceContainerHighest,
                borderColor: "transparent",
                rippleColor: hexToRgba(colors.onSurface, state.pressed),
            };
        case "outlined":
            return {
                backgroundColor: colors.surface,
                borderColor: colors.outlineVariant,
                rippleColor: hexToRgba(colors.primary, state.pressed),
            };
    }
}

export function getCardStyle({
    theme,
    variant,
    disabled = false,
}: CardStyleOptions): ViewStyle {
    const colors = getCardColors({ theme, variant, disabled });
    const elevationStyle =
        variant === "elevated" && !disabled
            ? theme.getElevationStyle("level1", theme.colors.shadow)
            : {};

    return {
        borderRadius: theme.shapes.large,
        borderCurve: "continuous",
        backgroundColor: colors.backgroundColor,
        borderWidth: variant === "outlined" ? 1 : 0,
        borderColor: colors.borderColor,
        padding: theme.spacing.lg,
        overflow: "hidden",
        ...elevationStyle,
    };
}
