import type { ViewStyle } from "react-native";
import type { DesignTheme } from "@/view/theme";
import { hexToRgba } from "@/view/theme";
import type {
    IconButtonSize,
    IconButtonShape,
    IconButtonVariant,
} from "@/view/components/iconButton/IconButton.types";

export type IconButtonStyleOptions = {
    theme: DesignTheme;
    variant: IconButtonVariant;
    size: IconButtonSize;
    shape: IconButtonShape;
    disabled: boolean;
    selected: boolean;
};

export const iconButtonDimensions: Record<IconButtonSize, { container: number; icon: number }> = {
    xs: { container: 32, icon: 18 },
    small: { container: 40, icon: 20 },
    medium: { container: 56, icon: 24 },
    large: { container: 96, icon: 32 },
    xl: { container: 136, icon: 40 },
};

export function getIconButtonColors({
    theme,
    variant,
    disabled,
    selected,
}: {
    theme: DesignTheme;
    variant: IconButtonVariant;
    disabled: boolean;
    selected: boolean;
}) {
    const { colors, state } = theme;

    if (disabled) {
        return {
            backgroundColor:
                variant === "standard" || variant === "outlined"
                    ? "transparent"
                    : hexToRgba(colors.onSurface, state.disabledContainer),
            contentColor: hexToRgba(colors.onSurface, state.disabledContent),
            borderColor:
                variant === "outlined"
                    ? hexToRgba(colors.onSurface, state.disabledContainer)
                    : "transparent",
            rippleColor: "transparent",
        };
    }

    switch (variant) {
        case "standard":
            return {
                backgroundColor: "transparent",
                contentColor: selected
                    ? colors.primary
                    : colors.onSurfaceVariant,
                borderColor: "transparent",
                rippleColor: hexToRgba(
                    selected ? colors.primary : colors.onSurfaceVariant,
                    state.pressed,
                ),
            };

        case "filled":
            return selected
                ? {
                    backgroundColor: colors.primaryContainer,
                    contentColor: colors.onPrimaryContainer,
                    borderColor: "transparent",
                    rippleColor: hexToRgba(colors.onPrimaryContainer, state.pressed),
                }
                : {
                    backgroundColor: colors.primary,
                    contentColor: colors.onPrimary,
                    borderColor: "transparent",
                    rippleColor: hexToRgba(colors.onPrimary, state.pressed),
                };

        case "tonal":
            return selected
                ? {
                    backgroundColor: colors.secondary,
                    contentColor: colors.onSecondary,
                    borderColor: "transparent",
                    rippleColor: hexToRgba(colors.onSecondary, state.pressed),
                }
                : {
                    backgroundColor: colors.secondaryContainer,
                    contentColor: colors.onSecondaryContainer,
                    borderColor: "transparent",
                    rippleColor: hexToRgba(colors.onSecondaryContainer, state.pressed),
                };

        case "outlined":
            return {
                backgroundColor: selected
                    ? colors.primaryContainer
                    : "transparent",
                contentColor: selected
                    ? colors.onPrimaryContainer
                    : colors.onSurfaceVariant, // Fixed: official M3 unselected outlined icon color
                borderColor: selected
                    ? colors.primary
                    : colors.outline,
                rippleColor: hexToRgba(
                    selected ? colors.onPrimaryContainer : colors.onSurfaceVariant,
                    state.pressed,
                ),
            };
    }
}

export function getIconButtonStyle({
    theme,
    variant,
    size,
    shape,
    disabled,
    selected,
}: IconButtonStyleOptions): ViewStyle {
    const buttonColors = getIconButtonColors({
        theme,
        variant,
        disabled,
        selected,
    });

    const dim = iconButtonDimensions[size].container;

    const borderRadius =
        shape === "square"
            ? theme.shapes.expressive.square[size]
            : theme.shapes.full;

    return {
        width: dim,
        height: dim,
        alignItems: "center",
        justifyContent: "center",
        borderRadius,
        borderCurve: "continuous",
        backgroundColor: buttonColors.backgroundColor,
        borderWidth: variant === "outlined" ? 1 : 0,
        borderColor: buttonColors.borderColor,
    };
}

export function getIconButtonContentColor(
    theme: DesignTheme,
    variant: IconButtonVariant,
    disabled: boolean,
    selected: boolean,
): string {
    return getIconButtonColors({
        theme,
        variant,
        disabled,
        selected,
    }).contentColor;
}
