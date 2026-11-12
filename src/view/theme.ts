// Tema do Barber Agenda: tokens (cor, espaçamento, forma, tipografia, movimento, elevação e
// estados), temas claro/escuro e utilitários de cor e alvo de toque. Único lugar com valores
// literais de estilo (regra STYLE-01 do harness).

import { Platform, type Insets, type TextStyle, type ViewStyle } from "react-native";

// --- cores: esquema tonal Material 3 (SchemeFidelity) gerado da marca orange-500 #FF8500,
// ver design-system/02-tokens.md
// --- tokens/colors.ts ------------------------------------------------------

export const lightColors = {
    primary: "#944B00",
    onPrimary: "#FFFFFF",
    primaryContainer: "#FF8500",
    onPrimaryContainer: "#602E00",
    secondary: "#895023",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#FEB37D",
    onSecondaryContainer: "#794317",
    tertiary: "#006494",
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#02AFFF",
    onTertiaryContainer: "#003F60",
    error: "#BA1A1A",
    onError: "#FFFFFF",
    errorContainer: "#FFDAD6",
    onErrorContainer: "#93000A",
    background: "#FFF8F5",
    onBackground: "#241912",
    surface: "#FFF8F5",
    onSurface: "#241912",
    surfaceVariant: "#FBDDC9",
    onSurfaceVariant: "#574335",
    surfaceDim: "#EBD6C9",
    surfaceBright: "#FFF8F5",
    surfaceContainerLowest: "#FFFFFF",
    surfaceContainerLow: "#FFF1E9",
    surfaceContainer: "#FFEADE",
    surfaceContainerHigh: "#FAE4D7",
    surfaceContainerHighest: "#F4DED2",
    outline: "#8A7262",
    outlineVariant: "#DEC1AE",
    inverseSurface: "#3B2E25",
    inverseOnSurface: "#FFEDE4",
    inversePrimary: "#FFB783",
    primaryFixed: "#FFDCC5",
    primaryFixedDim: "#FFB783",
    onPrimaryFixed: "#301400",
    onPrimaryFixedVariant: "#703700",
    secondaryFixed: "#FFDCC5",
    secondaryFixedDim: "#FFB783",
    onSecondaryFixed: "#301400",
    onSecondaryFixedVariant: "#6D3A0D",
    tertiaryFixed: "#CBE6FF",
    tertiaryFixedDim: "#8ECDFF",
    onTertiaryFixed: "#001E30",
    onTertiaryFixedVariant: "#004B71",
    scrim: "#000000",
    shadow: "#000000",
    surfaceTint: "#944B00",
} as const;

export const darkColors = {
    primary: "#FFB783",
    onPrimary: "#4F2500",
    primaryContainer: "#FF8500",
    onPrimaryContainer: "#602E00",
    secondary: "#FFB783",
    onSecondary: "#4F2500",
    secondaryContainer: "#6D3A0D",
    onSecondaryContainer: "#EEA570",
    tertiary: "#8ECDFF",
    onTertiary: "#00344F",
    tertiaryContainer: "#02AFFF",
    onTertiaryContainer: "#003F60",
    error: "#FFB4AB",
    onError: "#690005",
    errorContainer: "#93000A",
    onErrorContainer: "#FFDAD6",
    background: "#1B110A",
    onBackground: "#F4DED2",
    surface: "#1B110A",
    onSurface: "#F4DED2",
    surfaceVariant: "#574335",
    onSurfaceVariant: "#DEC1AE",
    surfaceDim: "#1B110A",
    surfaceBright: "#44362E",
    surfaceContainerLowest: "#160C06",
    surfaceContainerLow: "#241912",
    surfaceContainer: "#291D15",
    surfaceContainerHigh: "#34271F",
    surfaceContainerHighest: "#3F3229",
    outline: "#A68C7B",
    outlineVariant: "#574335",
    inverseSurface: "#F4DED2",
    inverseOnSurface: "#3B2E25",
    inversePrimary: "#944B00",
    primaryFixed: "#FFDCC5",
    primaryFixedDim: "#FFB783",
    onPrimaryFixed: "#301400",
    onPrimaryFixedVariant: "#703700",
    secondaryFixed: "#FFDCC5",
    secondaryFixedDim: "#FFB783",
    onSecondaryFixed: "#301400",
    onSecondaryFixedVariant: "#6D3A0D",
    tertiaryFixed: "#CBE6FF",
    tertiaryFixedDim: "#8ECDFF",
    onTertiaryFixed: "#001E30",
    onTertiaryFixedVariant: "#004B71",
    scrim: "#000000",
    shadow: "#000000",
    surfaceTint: "#FFB783",
} as const;

export type ColorTokens = {
    [K in keyof typeof lightColors]: string;
};

// --- tokens/spacing.ts -----------------------------------------------------

export const spacing = {
    none: 0,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
    massive: 48,
    giant: 64,
} as const;

export type SpacingTokens = typeof spacing;

// --- tokens/shapes.ts ------------------------------------------------------

export const shapes = {
    none: 0,
    extraSmall: 4,
    small: 8,
    medium: 12,
    large: 16,
    extraLarge: 28,
    full: 9999,

    // Specific bottom-sheet / top-sheet radii
    extraLargeTop: 28,

    // M3 Expressive Sized Shape Scales
    expressive: {
        round: {
            xs: 9999,
            small: 9999,
            medium: 9999,
            large: 9999,
            xl: 9999,
        },
        square: {
            xs: 8,
            small: 12,
            medium: 16,
            large: 28,
            xl: 36,
        },
    },
} as const;

export type ShapeTokens = typeof shapes;

/**
 * Returns continuous corner curve on iOS (squircle) and standard border curve on Android
 */
export function getBorderCurveStyle(): Pick<ViewStyle, "borderCurve"> {
    return {
        borderCurve: "continuous",
    };
}

// --- tokens/typography.ts --------------------------------------------------

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

// --- tokens/motion.ts ------------------------------------------------------

/**
 * Material Design 3 & Material Design 3 Expressive Motion Tokens
 * Ref: https://m3.material.io/styles/motion/easing-and-duration/tokens-specs
 */
export const motion = {
    duration: {
        short1: 50,
        short2: 100,
        short3: 150,
        short4: 200,

        medium1: 250,
        medium2: 300,
        medium3: 350,
        medium4: 400,

        long1: 450,
        long2: 500,
        long3: 550,
        long4: 600,

        extraLong1: 700,
        extraLong2: 800,
        extraLong3: 900,
        extraLong4: 1000,
    },

    easing: {
        standard: [0.2, 0, 0, 1] as const,
        standardAccelerate: [0.3, 0, 1, 1] as const,
        standardDecelerate: [0, 0, 0, 1] as const,
        emphasized: [0.2, 0, 0, 1] as const,
        emphasizedAccelerate: [0.3, 0, 0.8, 0.15] as const,
        emphasizedDecelerate: [0.05, 0.7, 0.1, 1] as const,
    },

    /**
     * M3 Expressive Physics-Based Spring Presets (for React Native Reanimated withSpring)
     */
    spring: {
        expressive: {
            damping: 14,
            stiffness: 180,
            mass: 1,
        },
        snappy: {
            damping: 20,
            stiffness: 300,
            mass: 0.8,
        },
        bouncy: {
            damping: 10,
            stiffness: 160,
            mass: 1,
        },
        gentle: {
            damping: 24,
            stiffness: 140,
            mass: 1,
        },
    },
} as const;

export type MotionTokens = typeof motion;

// --- tokens/elevation.ts ---------------------------------------------------

export const elevation = {
    level0: 0,
    level1: 1,
    level2: 3,
    level3: 6,
    level4: 8,
    level5: 12,
} as const;

export type ElevationLevel = keyof typeof elevation;

export const iosShadows: Record<ElevationLevel, Pick<ViewStyle, "shadowOffset" | "shadowOpacity" | "shadowRadius">> = {
    level0: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
    },
    level1: {
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.14,
        shadowRadius: 2,
    },
    level2: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.16,
        shadowRadius: 4,
    },
    level3: {
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 6,
    },
    level4: {
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.20,
        shadowRadius: 8,
    },
    level5: {
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.24,
        shadowRadius: 12,
    },
};

export function getElevationStyle(
    level: ElevationLevel,
    shadowColor: string = "#000000",
): ViewStyle {
    if (level === "level0") {
        return {
            elevation: 0,
            shadowColor: "transparent",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
        };
    }

    return {
        elevation: elevation[level],
        shadowColor,
        ...iosShadows[level],
    };
}

// --- tokens/state.ts -------------------------------------------------------

/**
 * Material Design 3 State Layer Opacities
 * Ref: https://m3.material.io/foundations/interaction-states
 */
export const stateTokens = {
    hover: 0.08,
    focus: 0.10,
    pressed: 0.12,
    dragged: 0.16,
    disabledContainer: 0.12,
    disabledContent: 0.38,
} as const;

export type StateTokens = typeof stateTokens;

// --- utils/color.ts --------------------------------------------------------

/**
 * Utility functions for robust color transformations
 */

/**
 * Converts a hex or rgba string to an rgba string with specified opacity.
 * Supports 3-digit hex (#FFF), 6-digit hex (#FFFFFF), 8-digit hex (#FFFFFFFF),
 * existing rgba/rgb strings, and named colors ('transparent').
 */
export function hexToRgba(color: string, opacity: number): string {
    if (!color) {
        return `rgba(0, 0, 0, ${opacity})`;
    }

    if (color === "transparent") {
        return "transparent";
    }

    const trimmed = color.trim();

    // RGB / RGBA string
    if (trimmed.startsWith("rgb")) {
        const parts = trimmed
            .replace(/rgba?\(|\)/g, "")
            .split(",")
            .map((p) => p.trim());
        const r = parseInt(parts[0] ?? "0", 10);
        const g = parseInt(parts[1] ?? "0", 10);
        const b = parseInt(parts[2] ?? "0", 10);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    // Hex string
    const hex = trimmed.replace("#", "");

    let r = 0;
    let g = 0;
    let b = 0;

    if (hex.length === 3) {
        r = parseInt((hex[0] ?? "0") + (hex[0] ?? "0"), 16);
        g = parseInt((hex[1] ?? "0") + (hex[1] ?? "0"), 16);
        b = parseInt((hex[2] ?? "0") + (hex[2] ?? "0"), 16);
    } else if (hex.length >= 6) {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
    } else {
        return `rgba(0, 0, 0, ${opacity})`;
    }

    if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
        return `rgba(0, 0, 0, ${opacity})`;
    }

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export const withAlpha = hexToRgba;

// --- utils/touchTarget.ts --------------------------------------------------

/**
 * Calculates hitSlop to guarantee accessibility compliance:
 * - Android (Material 3 / WCAG 2.5.5): 48×48dp
 * - iOS (Apple HIG): 44×44pt
 */
export function getHitSlop(
    width: number,
    height: number,
    minSize: number = Platform.OS === "ios" ? 44 : 48,
): Insets | undefined {
    const horizontalDiff = Math.max(0, minSize - width);
    const verticalDiff = Math.max(0, minSize - height);

    if (horizontalDiff === 0 && verticalDiff === 0) {
        return undefined;
    }

    const top = Math.ceil(verticalDiff / 2);
    const bottom = Math.floor(verticalDiff / 2);
    const left = Math.ceil(horizontalDiff / 2);
    const right = Math.floor(horizontalDiff / 2);

    return { top, bottom, left, right };
}

// --- theme/types.ts --------------------------------------------------------

export type ThemeMode = "light" | "dark";

export type DesignTheme = {
    mode: ThemeMode;
    colors: ColorTokens;
    spacing: SpacingTokens;
    shapes: ShapeTokens;
    typography: TypographyTokens;
    motion: MotionTokens;
    elevation: typeof elevation;
    getElevationStyle: typeof getElevationStyle;
    state: StateTokens;
};

// --- theme/light.ts --------------------------------------------------------

export const lightTheme: DesignTheme = {
    mode: "light",
    colors: lightColors,
    spacing,
    shapes,
    typography,
    motion,
    elevation,
    getElevationStyle,
    state: stateTokens,
};

// --- theme/dark.ts ---------------------------------------------------------

export const darkTheme: DesignTheme = {
    mode: "dark",
    colors: darkColors,
    spacing,
    shapes,
    typography,
    motion,
    elevation,
    getElevationStyle,
    state: stateTokens,
};
