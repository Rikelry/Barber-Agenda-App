import type { ViewStyle } from "react-native";
import type { DesignTheme } from "@/view/theme";
import { hexToRgba } from "@/view/theme";
import type { TextFieldVariant } from "@/view/components/textField/TextField.types";

export type TextFieldColorsOptions = {
    theme: DesignTheme;
    variant: TextFieldVariant;
    isFocused: boolean;
    hasError: boolean;
    disabled: boolean;
};

export function getTextFieldColors({
    theme,
    variant,
    isFocused,
    hasError,
    disabled,
}: TextFieldColorsOptions) {
    const { colors, state } = theme;

    if (disabled) {
        return {
            containerColor:
                variant === "filled"
                    ? hexToRgba(colors.onSurface, state.disabledContainer)
                    : "transparent",
            borderColor: hexToRgba(colors.onSurface, state.disabledContainer),
            textColor: hexToRgba(colors.onSurface, state.disabledContent),
            labelColor: hexToRgba(colors.onSurface, state.disabledContent),
            supportingColor: hexToRgba(colors.onSurface, state.disabledContent),
            indicatorColor: hexToRgba(colors.onSurface, state.disabledContainer),
        };
    }

    if (hasError) {
        return {
            containerColor:
                variant === "filled" ? colors.surfaceContainerHighest : "transparent",
            borderColor: colors.error,
            textColor: colors.onSurface,
            labelColor: colors.error,
            supportingColor: colors.error,
            indicatorColor: colors.error,
        };
    }

    if (isFocused) {
        return {
            containerColor:
                variant === "filled" ? colors.surfaceContainerHighest : "transparent",
            borderColor: colors.primary,
            textColor: colors.onSurface,
            labelColor: colors.primary,
            supportingColor: colors.onSurfaceVariant,
            indicatorColor: colors.primary,
        };
    }

    return {
        containerColor:
            variant === "filled" ? colors.surfaceContainerHighest : "transparent",
        borderColor: colors.outline,
        textColor: colors.onSurface,
        labelColor: colors.onSurfaceVariant,
        supportingColor: colors.onSurfaceVariant,
        indicatorColor: colors.onSurfaceVariant,
    };
}

export function getTextFieldContainerStyle({
    theme,
    variant,
    isFocused,
    hasError,
    disabled,
}: TextFieldColorsOptions): ViewStyle {
    const colors = getTextFieldColors({
        theme,
        variant,
        isFocused,
        hasError,
        disabled,
    });

    const isOutlined = variant === "outlined";

    return {
        minHeight: 56,
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.sm,
        borderRadius: isOutlined ? theme.shapes.extraSmall : theme.shapes.extraSmall,
        borderCurve: "continuous",
        backgroundColor: colors.containerColor,
        borderWidth: isOutlined ? (isFocused || hasError ? 2 : 1) : 0,
        borderBottomWidth: isOutlined ? (isFocused || hasError ? 2 : 1) : (isFocused || hasError ? 2 : 1),
        borderColor: colors.borderColor,
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.md,
    };
}
