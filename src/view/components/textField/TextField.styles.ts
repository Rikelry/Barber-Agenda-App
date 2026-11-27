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

type TextFieldContainerOptions = TextFieldColorsOptions & {
    multiline?: boolean;
    /** Canto extra-small (4 dp) do outlined text field do Material 3. */
    compactShape?: boolean;
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

            borderColor: hexToRgba(
                colors.onSurface,
                state.disabledContainer
            ),

            textColor: hexToRgba(
                colors.onSurface,
                state.disabledContent
            ),

            labelColor: hexToRgba(
                colors.onSurface,
                state.disabledContent
            ),

            supportingColor: hexToRgba(
                colors.onSurface,
                state.disabledContent
            ),

            indicatorColor: hexToRgba(
                colors.onSurface,
                state.disabledContent
            ),
        };
    }

    if (hasError) {
        return {
            containerColor:
                variant === "filled"
                    ? colors.surfaceContainerHighest
                    : "transparent",
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
                variant === "filled"
                    ? colors.surfaceContainerHighest
                    : "transparent",
            borderColor: colors.primary,
            textColor: colors.onSurface,
            labelColor: colors.primary,
            supportingColor: colors.onSurfaceVariant,
            indicatorColor: colors.primary,
        };
    }

    return {
        containerColor:
            variant === "filled"
                ? colors.surfaceContainerHighest
                : "transparent",
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
    multiline = false,
    compactShape = false,
}: TextFieldContainerOptions): ViewStyle {
    const colors = getTextFieldColors({
        theme,
        variant,
        isFocused,
        hasError,
        disabled,
    });

    const isOutlined = variant === "outlined";
    const indicatorWidth = isFocused || hasError ? 2 : 1;

    return {
        minHeight: multiline ? 112 : 56,

        paddingHorizontal: theme.spacing.md,
        paddingVertical: multiline ? theme.spacing.md : theme.spacing.none,

        flexDirection: "row",
        alignItems: multiline ? "flex-start" : "center",
        gap: theme.spacing.md,

        backgroundColor: colors.containerColor,
        borderCurve: "continuous",

        ...(isOutlined
            ? {
                borderWidth: indicatorWidth,
                borderColor: colors.borderColor,
                borderRadius: compactShape ? theme.shapes.extraSmall : theme.shapes.small,
            }
            : {
                borderBottomWidth: indicatorWidth,
                borderBottomColor: colors.indicatorColor,

                borderTopLeftRadius: theme.shapes.small,
                borderTopRightRadius: theme.shapes.small,

                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
            }),
    };
}
