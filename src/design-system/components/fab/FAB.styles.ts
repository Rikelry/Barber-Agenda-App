import type { ViewStyle } from "react-native";
import type { DesignTheme } from "../../theme/types";
import { hexToRgba } from "../../utils/color";
import type { FABSize, FABVariant } from "./FAB.types";

export const fabDimensions = {
    small: { container: 40, icon: 20, shape: 12 },
    medium: { container: 56, icon: 24, shape: 16 },
    large: { container: 96, icon: 36, shape: 28 },
};

export function getFABColors({
    theme,
    variant,
    disabled = false,
}: {
    theme: DesignTheme;
    variant: FABVariant;
    disabled?: boolean;
}) {
    const { colors, state } = theme;

    if (disabled) {
        return {
            backgroundColor: hexToRgba(colors.onSurface, state.disabledContainer),
            contentColor: hexToRgba(colors.onSurface, state.disabledContent),
            rippleColor: "transparent",
        };
    }

    switch (variant) {
        case "primary":
            return {
                backgroundColor: colors.primaryContainer,
                contentColor: colors.onPrimaryContainer,
                rippleColor: hexToRgba(colors.onPrimaryContainer, state.pressed),
            };
        case "surface":
            return {
                backgroundColor: colors.surfaceContainerHigh,
                contentColor: colors.primary,
                rippleColor: hexToRgba(colors.primary, state.pressed),
            };
        case "secondary":
            return {
                backgroundColor: colors.secondaryContainer,
                contentColor: colors.onSecondaryContainer,
                rippleColor: hexToRgba(colors.onSecondaryContainer, state.pressed),
            };
        case "tertiary":
            return {
                backgroundColor: colors.tertiaryContainer,
                contentColor: colors.onTertiaryContainer,
                rippleColor: hexToRgba(colors.onTertiaryContainer, state.pressed),
            };
    }
}

export function getFABStyle({
    theme,
    variant,
    size,
    disabled = false,
}: {
    theme: DesignTheme;
    variant: FABVariant;
    size: FABSize;
    disabled?: boolean;
}): ViewStyle {
    const colors = getFABColors({ theme, variant, disabled });
    const config = fabDimensions[size];

    const elevationStyle = disabled
        ? {}
        : theme.getElevationStyle("level3", theme.colors.shadow);

    return {
        width: config.container,
        height: config.container,
        borderRadius: config.shape,
        borderCurve: "continuous",
        backgroundColor: colors.backgroundColor,
        alignItems: "center",
        justifyContent: "center",
        ...elevationStyle,
    };
}
