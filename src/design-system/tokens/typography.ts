import { Platform, type TextStyle } from "react-native";

export const fontFamilies = {
    android: {
        regular: "sans-serif",
        medium: "sans-serif-medium",
        light: "sans-serif-light",
        thin: "sans-serif-thin",
    },
    ios: {
        regular: "System",
        medium: "System",
        light: "System",
        thin: "System",
    },
} as const;

export function getPlatformFontFamily(weight: TextStyle["fontWeight"] = "400"): string {
    if (Platform.OS === "android") {
        if (weight === "500" || weight === "600" || weight === "700" || weight === "bold") {
            return fontFamilies.android.medium;
        }
        return fontFamilies.android.regular;
    }
    return fontFamilies.ios.regular;
}

export const typography = {
    displayLarge: {
        fontSize: 57,
        lineHeight: 64,
        letterSpacing: -0.25,
        fontWeight: "400",
    },
    displayMedium: {
        fontSize: 45,
        lineHeight: 52,
        letterSpacing: 0,
        fontWeight: "400",
    },
    displaySmall: {
        fontSize: 36,
        lineHeight: 44,
        letterSpacing: 0,
        fontWeight: "400",
    },

    headlineLarge: {
        fontSize: 32,
        lineHeight: 40,
        letterSpacing: 0,
        fontWeight: "400",
    },
    headlineMedium: {
        fontSize: 28,
        lineHeight: 36,
        letterSpacing: 0,
        fontWeight: "400",
    },
    headlineSmall: {
        fontSize: 24,
        lineHeight: 32,
        letterSpacing: 0,
        fontWeight: "400",
    },

    titleLarge: {
        fontSize: 22,
        lineHeight: 28,
        letterSpacing: 0,
        fontWeight: "400",
    },
    titleMedium: {
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0.15,
        fontWeight: "500",
    },
    titleSmall: {
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.1,
        fontWeight: "500",
    },

    bodyLarge: {
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0.5,
        fontWeight: "400",
    },
    bodyMedium: {
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.25,
        fontWeight: "400",
    },
    bodySmall: {
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0.4,
        fontWeight: "400",
    },

    labelLarge: {
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0.1,
        fontWeight: "500",
    },
    labelMedium: {
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0.5,
        fontWeight: "500",
    },
    labelSmall: {
        fontSize: 11,
        lineHeight: 16,
        letterSpacing: 0.5,
        fontWeight: "500",
    },
} as const;

export type TypographyTokens = typeof typography;
export type TypographyVariant = keyof typeof typography;
