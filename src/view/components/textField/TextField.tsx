import { useRef, useState, type ComponentRef } from "react";

import { TextInput, View, type TextInputProps } from "react-native";

import { useDesignSystem } from "@/view/components/themeProvider";
import { getPlatformFontFamily } from "@/view/theme";
import { Typography } from "@/view/components/typography";

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
    defaultValue = "",

    placeholder,
    onChangeText,
    onFocus,
    onBlur,

    containerStyle,
    inputStyle,

    accessibilityLabel,
    accessibilityHint,
    accessibilityState,

    multiline = false,

    ...textInputProps
}: TextFieldProps) => {
    const { theme } = useDesignSystem();

    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<ComponentRef<typeof TextInput>>(null);

    // Internal value supports uncontrolled usage.
    const [internalValue, setInternalValue] = useState(defaultValue);

    // Controlled or uncontrolled value.
    const currentValue = value !== undefined
        ? value ?? ""
        : internalValue;

    const hasError = Boolean(errorText);

    const colors = getTextFieldColors({
        theme,
        variant,
        isFocused,
        hasError,
        disabled,
    });

    const containerResolvedStyle = getTextFieldContainerStyle({
        theme,
        variant,
        isFocused,
        hasError,
        disabled,
        multiline,
    });

    const handleChangeText = (text: string) => {
        setInternalValue(text);
        onChangeText?.(text);
    };

    const handleFocus: NonNullable<TextInputProps["onFocus"]> = (event) => {
        setIsFocused(true);
        onFocus?.(event);
    };

    const handleBlur: NonNullable<TextInputProps["onBlur"]> = (event) => {
        setIsFocused(false);
        onBlur?.(event);
    };

    const renderIcon = (
        icon: TextFieldProps["leadingIcon"]
    ) => {
        if (!icon) {
            return null;
        }

        if (typeof icon === "function") {
            return icon(colors.labelColor);
        }

        return icon;
    };

    return (
        <View
            style={[
                {
                    width: "100%",
                    gap: theme.spacing.xs,
                },
                containerStyle,
            ]}
        >
            {/* Rótulo fixo acima do campo (canvas de telas): 12/16, cor de texto secundário. */}
            {label ? (
                <Typography
                    variant="bodySmall"
                    style={{ color: colors.labelColor }}
                    onPress={() => inputRef.current?.focus()}
                    accessibilityElementsHidden
                    importantForAccessibility="no"
                >
                    {label}
                </Typography>
            ) : null}

            <View style={containerResolvedStyle}>
                {leadingIcon && (
                    <View
                        style={{
                            alignItems: multiline ? "flex-start" : "center",
                            justifyContent: multiline ? "flex-start" : "center",
                            paddingTop: multiline ? theme.spacing.md : theme.spacing.none,
                        }}
                    >
                        {renderIcon(leadingIcon)}
                    </View>
                )}

                <View
                    style={{
                        flex: 1,
                        minHeight: multiline ? 88 : 56,
                        justifyContent: multiline ? "flex-start" : "center",
                    }}
                >
                    <TextInput
                        ref={inputRef}
                        {...textInputProps}
                        value={currentValue}
                        onChangeText={handleChangeText}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        editable={!disabled}
                        multiline={multiline}
                        accessibilityLabel={accessibilityLabel ?? label}
                        accessibilityHint={
                            accessibilityHint ?? errorText ?? supportingText
                        }
                        accessibilityState={{
                            ...accessibilityState,
                            disabled,
                        }}
                        placeholder={placeholder}
                        placeholderTextColor={theme.colors.onSurfaceVariant}
                        style={[
                            {
                                width: "100%",
                                color: colors.textColor,
                                fontSize: theme.typography.bodyLarge.fontSize,
                                lineHeight: theme.typography.bodyLarge.lineHeight,
                                fontFamily: getPlatformFontFamily("400"),
                                padding: theme.spacing.none,
                                margin: theme.spacing.none,
                                minHeight: multiline ? 88 : 24,
                                textAlignVertical: multiline ? "top" : "center",
                            },
                            inputStyle,
                        ]}
                    />
                </View>

                {trailingIcon && (
                    <View
                        style={{
                            alignItems: multiline ? "flex-start" : "center",
                            justifyContent: multiline ? "flex-start" : "center",
                            paddingTop: multiline ? theme.spacing.md : theme.spacing.none,
                        }}
                    >
                        {renderIcon(trailingIcon)}
                    </View>
                )}
            </View>

            {(errorText || supportingText) && (
                <Typography
                    variant="bodySmall"
                    style={{
                        color: colors.supportingColor,
                    }}
                    accessibilityLiveRegion={errorText ? "polite" : "none"}
                >
                    {errorText || supportingText}
                </Typography>
            )}
        </View>
    );
}
