import { useEffect, useState } from "react";

import {
    Animated,
    Easing,
    TextInput,
    View,
    type TextInputProps,
} from "react-native";

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
    labelAlwaysFloating = false,
    labelBackgroundColor,

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

    // Internal value supports uncontrolled usage.
    const [internalValue, setInternalValue] = useState(defaultValue);

    // Controlled or uncontrolled value.
    const currentValue = value !== undefined
        ? value ?? ""
        : internalValue;

    const hasText = currentValue.length > 0;
    const hasError = Boolean(errorText);

    // Floating label state.
    const shouldFloatLabel =
        Boolean(label) &&
        (isFocused || hasText || labelAlwaysFloating);

    // Animation progress: 0 = expanded, 1 = floating.
    const [labelProgress] = useState(
        () => new Animated.Value(shouldFloatLabel ? 1 : 0),
    );

    useEffect(() => {
        const animation = Animated.timing(labelProgress, {
            toValue: shouldFloatLabel ? 1 : 0,
            duration: theme.motion.duration.medium1,
            easing: Easing.bezier(
                ...theme.motion.easing.emphasized
            ),
            useNativeDriver: false,
        });

        animation.start();

        return () => {
            animation.stop();
        };
    }, [
        shouldFloatLabel,
        labelProgress,
        theme.motion.duration.medium1,
        theme.motion.easing.emphasized,
    ]);

    // Animated label properties.
    const animatedLabelTop = labelProgress.interpolate({
        inputRange: [0, 1],
        outputRange:
            variant === "outlined"
                ? [16, -8]
                : [16, 5],
    });

    const animatedLabelSize = labelProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.typography.bodyLarge.fontSize, theme.typography.bodySmall.fontSize],
    });

    const animatedLabelLineHeight = labelProgress.interpolate({
        inputRange: [0, 1],
        outputRange: [theme.typography.bodyLarge.lineHeight, theme.typography.bodySmall.lineHeight],
    });

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
                    {label && (
                        <Animated.Text
                            pointerEvents="none"
                            numberOfLines={1}
                            style={[
                                theme.typography.bodyLarge,
                                {
                                    position: "absolute",
                                    left: 0,
                                    top: animatedLabelTop,

                                    fontSize: animatedLabelSize,
                                    lineHeight: animatedLabelLineHeight,

                                    color: colors.labelColor,

                                    fontFamily: getPlatformFontFamily("400"),

                                    backgroundColor:
                                        shouldFloatLabel &&
                                            variant === "outlined"
                                            ? labelBackgroundColor ?? theme.colors.surface
                                            : "transparent",

                                    paddingHorizontal:
                                        shouldFloatLabel &&
                                            variant === "outlined"
                                            ? theme.spacing.xs
                                            : theme.spacing.none,

                                    zIndex: 1,
                                },
                            ]}
                        >
                            {label}
                        </Animated.Text>
                    )}

                    <TextInput
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
                        placeholder={
                            label
                                ? shouldFloatLabel
                                    ? placeholder
                                    : undefined
                                : placeholder
                        }
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
                                marginTop: shouldFloatLabel ? theme.spacing.md : theme.spacing.none,
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
                        paddingHorizontal: theme.spacing.md,
                    }}
                >
                    {errorText || supportingText}
                </Typography>
            )}
        </View>
    );
}
