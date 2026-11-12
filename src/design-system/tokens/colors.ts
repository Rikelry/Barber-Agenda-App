export const lightColors = {
    primary: "#6750A4",
    onPrimary: "#FFFFFF",
    primaryContainer: "#EADDFF",
    onPrimaryContainer: "#21005D",

    secondary: "#625B71",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#E8DEF8",
    onSecondaryContainer: "#1D192B",

    tertiary: "#7D5260",
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#FFD8E4",
    onTertiaryContainer: "#31111D",

    error: "#BA1A1A",
    onError: "#FFFFFF",
    errorContainer: "#FFDAD6",
    onErrorContainer: "#410002",

    background: "#FEF7FF",
    onBackground: "#1D1B20",

    surface: "#FEF7FF",
    onSurface: "#1D1B20",
    surfaceVariant: "#E7E0EC",
    onSurfaceVariant: "#49454F",

    surfaceDim: "#DED8E1",
    surfaceBright: "#FEF7FF",

    surfaceContainerLowest: "#FFFFFF",
    surfaceContainerLow: "#F7F2FA",
    surfaceContainer: "#F3EDF7",
    surfaceContainerHigh: "#ECE6F0",
    surfaceContainerHighest: "#E6E0E9",

    outline: "#79747E",
    outlineVariant: "#CAC4D0",

    inverseSurface: "#322F35",
    inverseOnSurface: "#F5EFF7",
    inversePrimary: "#D0BCFF",

    primaryFixed: "#EADDFF",
    primaryFixedDim: "#D0BCFF",
    onPrimaryFixed: "#21005D",
    onPrimaryFixedVariant: "#4F378B",

    secondaryFixed: "#E8DEF8",
    secondaryFixedDim: "#CCC2DC",
    onSecondaryFixed: "#1D192B",
    onSecondaryFixedVariant: "#4A4458",

    tertiaryFixed: "#FFD8E4",
    tertiaryFixedDim: "#EFB8C8",
    onTertiaryFixed: "#31111D",
    onTertiaryFixedVariant: "#633B48",

    scrim: "#000000",
    shadow: "#000000",

    surfaceTint: "#6750A4",
} as const;

export const darkColors = {
    primary: "#D0BCFF",
    onPrimary: "#381E72",
    primaryContainer: "#4F378B",
    onPrimaryContainer: "#EADDFF",

    secondary: "#CCC2DC",
    onSecondary: "#332D41",
    secondaryContainer: "#4A4458",
    onSecondaryContainer: "#E8DEF8",

    tertiary: "#EFB8C8",
    onTertiary: "#492532",
    tertiaryContainer: "#633B48",
    onTertiaryContainer: "#FFD8E4",

    error: "#FFB4AB",
    onError: "#690005",
    errorContainer: "#93000A",
    onErrorContainer: "#FFDAD6",

    background: "#141218",
    onBackground: "#E6E0E9",

    surface: "#141218",
    onSurface: "#E6E0E9",
    surfaceVariant: "#49454F",
    onSurfaceVariant: "#CAC4D0",

    surfaceDim: "#141218",
    surfaceBright: "#3B383E",

    surfaceContainerLowest: "#0F0D13",
    surfaceContainerLow: "#1D1B20",
    surfaceContainer: "#211F26",
    surfaceContainerHigh: "#2B2930",
    surfaceContainerHighest: "#36343B",

    outline: "#938F99",
    outlineVariant: "#49454F",

    inverseSurface: "#E6E0E9",
    inverseOnSurface: "#322F35",
    inversePrimary: "#6750A4",

    primaryFixed: "#EADDFF",
    primaryFixedDim: "#D0BCFF",
    onPrimaryFixed: "#21005D",
    onPrimaryFixedVariant: "#4F378B",

    secondaryFixed: "#E8DEF8",
    secondaryFixedDim: "#CCC2DC",
    onSecondaryFixed: "#1D192B",
    onSecondaryFixedVariant: "#4A4458",

    tertiaryFixed: "#FFD8E4",
    tertiaryFixedDim: "#EFB8C8",
    onTertiaryFixed: "#31111D",
    onTertiaryFixedVariant: "#633B48",

    scrim: "#000000",
    shadow: "#000000",

    surfaceTint: "#D0BCFF",
} as const;

export type ColorTokens = {
    [K in keyof typeof lightColors]: string;
};
