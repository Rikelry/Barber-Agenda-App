import { useState } from "react";
import {
    TextInput,
    View,
    type NativeSyntheticEvent,
    type TargetedEvent,
} from "react-native";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import { getPlatformFontFamily } from "@/view/theme";
import {
    getTextFieldColors,
    getTextFieldContainerStyle,
} from "@/view/components/textField/TextField.styles";
import type { TextFieldProps } from "@/view/components/textField/TextField.types";

export const TextField = ({
    label,
    supportingText,
    errorText,
    variant = "outlined",
    leadingIcon,
    trailingIcon,
    disabled = false,
    value,
    containerStyle,
    inputStyle,
    onFocus,
    onBlur,
    ...textInputProps
}: TextFieldProps) => {
    const { theme } = useDesignSystem();
    const [isFocused, setIsFocused] = useState(false);

    const hasError = Boolean(errorText);
    const colors = getTextFieldColors({
        theme,
        variant,
        isFocused,
        hasError,
        disabled,
    });

    const containerStyleResolved = getTextFieldContainerStyle({
        theme,
        variant,
        isFocused,
        hasError,
        disabled,
    });

    const handleFocus = (e: NativeSyntheticEvent<TargetedEvent>) => {
        setIsFocused(true);
        onFocus?.(e as never);
    };

    const handleBlur = (e: NativeSyntheticEvent<TargetedEvent>) => {
        setIsFocused(false);
        onBlur?.(e as never);
    };

    const renderLeading = () => {
        if (!leadingIcon) return null;
        if (typeof leadingIcon === "function") {
            return leadingIcon(colors.labelColor);
        }
        return leadingIcon;
    };

    const renderTrailing = () => {
        if (!trailingIcon) return null;
        if (typeof trailingIcon === "function") {
            return trailingIcon(colors.labelColor);
        }
        return trailingIcon;
    };

    return (
        <View style={[{ gap: theme.spacing.xs, width: "100%" }, containerStyle]}>
            <View style={containerStyleResolved}>
                {leadingIcon && (
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        {renderLeading()}
                    </View>
                )}

                <View style={{ flex: 1, justifyContent: "center" }}>
                    {label && (
                        <Typography
                            variant="bodySmall"
                            style={{
                                color: colors.labelColor,
                                fontSize: theme.typography.bodySmall.fontSize,
                                lineHeight: 16,
                            }}
                        >
                            {label}
                        </Typography>
                    )}

                    <TextInput
                        {...textInputProps}
                        value={value}
                        editable={!disabled}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholderTextColor={theme.colors.onSurfaceVariant}
                        style={[
                            {
                                color: colors.textColor,
                                fontSize: theme.typography.bodyLarge.fontSize,
                                lineHeight: 22,
                                fontFamily: getPlatformFontFamily("400"),
                                padding: theme.spacing.none,
                                margin: theme.spacing.none,
                            },
                            inputStyle,
                        ]}
                    />
                </View>

                {trailingIcon && (
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                        {renderTrailing()}
                    </View>
                )}
            </View>

            {(errorText || supportingText) && (
                <Typography
                    variant="bodySmall"
                    style={{
                        color: colors.supportingColor,
                        paddingHorizontal: theme.spacing.md,
                    }}
                >
                    {errorText || supportingText}
                </Typography>
            )}
        </View>
    );
}
