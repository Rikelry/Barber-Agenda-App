import type { ViewStyle } from "react-native";
import type { DesignTheme } from "../../theme/types";
import { hexToRgba } from "../../utils/color";
import type { ButtonSize, ButtonShape, ButtonVariant } from "./Button.types";
import type { TypographyVariant } from "../../tokens/typography";

export type ButtonStyleOptions = {
    theme: DesignTheme;
    variant: ButtonVariant;
    size: ButtonSize;
    shape: ButtonShape;
    disabled: boolean;
    hasLeadingIcon: boolean;
    hasTrailingIcon: boolean;
};

export const buttonSizes = {
    xs: {
        height: 32,
        paddingWithoutIcon: 16,
        paddingWithLeadingIcon: 12,
        paddingWithTrailingIcon: 12,
        iconSize: 18,
        typography: "labelSmall" as TypographyVariant,
    },
    small: {
        height: 40,
        paddingWithoutIcon: 24,
        paddingWithLeadingIcon: 16,
        paddingWithTrailingIcon: 16,
        iconSize: 20,
        typography: "labelLarge" as TypographyVariant,
    },
    medium: {
        height: 56,
        paddingWithoutIcon: 32,
        paddingWithLeadingIcon: 24,
        paddingWithTrailingIcon: 24,
        iconSize: 24,
        typography: "titleMedium" as TypographyVariant,
    },
    large: {
        height: 96,
        paddingWithoutIcon: 48,
        paddingWithLeadingIcon: 32,
        paddingWithTrailingIcon: 32,
        iconSize: 32,
        typography: "headlineSmall" as TypographyVariant,
    },
    xl: {
        height: 136,
        paddingWithoutIcon: 56,
        paddingWithLeadingIcon: 40,
        paddingWithTrailingIcon: 40,
        iconSize: 40,
        typography: "headlineMedium" as TypographyVariant,
    },
} as const;

export function getButtonColors({
    theme,
    variant,
    disabled,
}: {
    theme: DesignTheme;
    variant: ButtonVariant;
    disabled: boolean;
}) {
    const { colors, state } = theme;

    if (disabled) {
        return {
            backgroundColor:
                variant === "outlined" || variant === "text"
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
        case "filled":
            return {
                backgroundColor: colors.primary,
                contentColor: colors.onPrimary,
                borderColor: "transparent",
                rippleColor: hexToRgba(colors.onPrimary, state.pressed),
            };

        case "elevated":
            return {
                backgroundColor: colors.surfaceContainerLow,
                contentColor: colors.primary,
                borderColor: "transparent",
                rippleColor: hexToRgba(colors.primary, state.pressed),
            };

        case "tonal":
            return {
                backgroundColor: colors.secondaryContainer,
                contentColor: colors.onSecondaryContainer,
                borderColor: "transparent",
                rippleColor: hexToRgba(colors.onSecondaryContainer, state.pressed),
            };

        case "outlined":
            return {
                backgroundColor: "transparent",
                contentColor: colors.primary,
                borderColor: colors.outline,
                rippleColor: hexToRgba(colors.primary, state.pressed),
            };

        case "text":
            return {
                backgroundColor: "transparent",
                contentColor: colors.primary,
                borderColor: "transparent",
                rippleColor: hexToRgba(colors.primary, state.pressed),
            };
    }
}

export function getButtonStyle({
    theme,
    variant,
    size,
    shape,
    disabled,
    hasLeadingIcon,
    hasTrailingIcon,
}: ButtonStyleOptions): ViewStyle {
    const colors = getButtonColors({ theme, variant, disabled });
    const sizeConfig = buttonSizes[size];

    const paddingLeft = hasLeadingIcon
        ? sizeConfig.paddingWithLeadingIcon
        : sizeConfig.paddingWithoutIcon;

    const paddingRight = hasTrailingIcon
        ? sizeConfig.paddingWithTrailingIcon
        : sizeConfig.paddingWithoutIcon;

    const borderRadius =
        shape === "square"
            ? theme.shapes.expressive.square[size]
            : theme.shapes.expressive.round[size];

    const elevationStyle =
        variant === "elevated" && !disabled
            ? theme.getElevationStyle("level1", theme.colors.shadow)
            : {};

    return {
        minHeight: sizeConfig.height,
        paddingLeft,
        paddingRight,
        borderRadius,
        borderCurve: "continuous",
        backgroundColor: colors.backgroundColor,
        borderWidth: variant === "outlined" ? 1 : 0,
        borderColor: colors.borderColor,

        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: size === "xs" ? 6 : size === "small" ? 8 : 12,

        ...elevationStyle,
    };
}

export function getButtonContentColor(
    theme: DesignTheme,
    variant: ButtonVariant,
    disabled: boolean,
): string {
    return getButtonColors({
        theme,
        variant,
        disabled,
    }).contentColor;
}
