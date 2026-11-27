// Tema do Barber Agenda: tokens (cor, espaçamento, forma, tipografia, movimento, elevação e
// estados), temas claro/escuro e utilitários de cor e alvo de toque. Único lugar com valores
// literais de estilo (regra STYLE-01 do harness).

import { Platform, type Insets, type TextStyle, type ViewStyle } from "react-native";

// --- cores: design system marrom (design-system/02-tokens.md, 0.3.0). O modo claro usa a paleta
// da Home redesenhada (espresso, bege e creme). O cinza taupe-500 (#85776D) não chega a 4,5:1 sobre
// as superfícies, por isso fica só em bordas; o texto secundário usa brown-700 (#79583F). O modo escuro
// continua com os primitivos brown-* e neutral-* da 0.1.3 (lacuna registrada no 02-tokens.md).
// --- tokens/colors.ts ------------------------------------------------------

export const lightColors = {
    primary: "#39200F",
    onPrimary: "#FFFFFF",
    primaryContainer: "#F3DFCB",
    onPrimaryContainer: "#39200F",
    secondary: "#603514",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#EBD0B7",
    onSecondaryContainer: "#39200F",
    tertiary: "#603514",
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#F3DFCB",
    onTertiaryContainer: "#39200F",
    error: "#BA1A1A",
    onError: "#FFFFFF",
    errorContainer: "#FFDAD6",
    onErrorContainer: "#93000A",
    background: "#FFF8F1",
    onBackground: "#392719",
    surface: "#FFF8F1",
    onSurface: "#392719",
    surfaceVariant: "#F8E9DC",
    onSurfaceVariant: "#79583F",
    surfaceDim: "#EBD0B7",
    surfaceBright: "#FFF8F1",
    surfaceContainerLowest: "#FFFFFF",
    surfaceContainerLow: "#FFF8F1",
    surfaceContainer: "#F8E9DC",
    surfaceContainerHigh: "#F3DFCB",
    surfaceContainerHighest: "#EBD0B7",
    outline: "#85776D",
    outlineVariant: "#EBD0B7",
    inverseSurface: "#39200F",
    inverseOnSurface: "#FFF8F1",
    inversePrimary: "#EBD0B7",
    primaryFixed: "#F3DFCB",
    primaryFixedDim: "#EBD0B7",
    onPrimaryFixed: "#39200F",
    onPrimaryFixedVariant: "#603514",
    secondaryFixed: "#F3DFCB",
    secondaryFixedDim: "#EBD0B7",
    onSecondaryFixed: "#39200F",
    onSecondaryFixedVariant: "#603514",
    tertiaryFixed: "#F8E9DC",
    tertiaryFixedDim: "#EBD0B7",
    onTertiaryFixed: "#39200F",
    onTertiaryFixedVariant: "#603514",
    scrim: "#000000",
    shadow: "#39200F",
    surfaceTint: "#39200F",
} as const;

export const darkColors = {
    primary: "#CDAB8F",
    onPrimary: "#241A14",
    primaryContainer: "#63452C",
    onPrimaryContainer: "#F5EDE6",
    secondary: "#B5835A",
    onSecondary: "#241A14",
    secondaryContainer: "#63452C",
    onSecondaryContainer: "#F5EDE6",
    tertiary: "#CDAB8F",
    onTertiary: "#241A14",
    tertiaryContainer: "#63452C",
    onTertiaryContainer: "#F5EDE6",
    error: "#FFB4AB",
    onError: "#690005",
    errorContainer: "#93000A",
    onErrorContainer: "#FFDAD6",
    background: "#1D1712",
    onBackground: "#F5EDE6",
    surface: "#1D1712",
    onSurface: "#F5EDE6",
    surfaceVariant: "#241A14",
    onSurfaceVariant: "#CDAB8F",
    surfaceDim: "#1D1712",
    surfaceBright: "#241A14",
    surfaceContainerLowest: "#1D1712",
    surfaceContainerLow: "#1D1712",
    surfaceContainer: "#241A14",
    surfaceContainerHigh: "#241A14",
    surfaceContainerHighest: "#241A14",
    outline: "#B5835A",
    outlineVariant: "#756B63",
    inverseSurface: "#F5EDE6",
    inverseOnSurface: "#241A14",
    inversePrimary: "#63452C",
    primaryFixed: "#CDAB8F",
    primaryFixedDim: "#B5835A",
    onPrimaryFixed: "#241A14",
    onPrimaryFixedVariant: "#63452C",
    secondaryFixed: "#CDAB8F",
    secondaryFixedDim: "#B5835A",
    onSecondaryFixed: "#241A14",
    onSecondaryFixedVariant: "#63452C",
    tertiaryFixed: "#E7DED6",
    tertiaryFixedDim: "#CDAB8F",
    onTertiaryFixed: "#241A14",
    onTertiaryFixedVariant: "#63452C",
    scrim: "#000000",
    shadow: "#000000",
    surfaceTint: "#CDAB8F",
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

// --- tamanhos de componentes (design-system/04-componentes) -----------------

export const componentSizes = {
    /** avatar.md: pequeno (listas compactas), médio (listas e Home), grande (perfil). */
    avatar: { small: 32, medium: 48, large: 96 },
    /** Logo do app na tela de login (assets/images/logo.svg). */
    brandMark: { size: 112, radius: 24 },
    /** tabs.md (variante linha): espessura do indicador da aba ativa. */
    tabs: { indicator: 3 },
    /** perfil-menu.md: item de duas linhas, recuo do divisor (depois do ícone) e foto da barbearia. */
    profileMenu: { itemHeight: 72, dividerInset: 80, barbershopImage: 64 },
    /** segmented-button.md (M3 outlined segmented button): altura e ícone. */
    segmentedButton: { height: 40, icon: 18 },
    /** Linha de lista com duas linhas de texto (menu do Perfil, profissionais). */
    listItem: { twoLine: 64 },
    /** Imagem de barbearia: miniatura nos cards e capa no detalhe. */
    thumbnail: { card: 72, list: 64, summary: 56, heroHeight: 180 },
    /** Barra de passos do agendamento. */
    progress: { height: 4 },
    /** Agendar: cartão de cada profissional e botão de cada dia. */
    professionalCard: { width: 96 },
    dayButton: { height: 56 },
    /** Portfólio: altura de cada foto da grade (3 colunas) e da foto grande. */
    portfolio: { gridHeight: 118, previewHeight: 260 },
    /** Esqueleto de carregamento (padrão 2 de 05-padroes.md). */
    skeleton: { line: 16, card: 96 },
    /** upload-imagem.md: botão de câmera sobre a foto. */
    photoPicker: { badge: 36 },
    /** campo-de-texto.md: altura do outlined text field (M3). */
    textField: { height: 56 },
    /** barra-busca.md: altura do contêiner. */
    searchBar: { height: 56 },
    /** tab-bar.md: indicador de fundo da aba ativa. */
    tabBar: { indicatorWidth: 64, indicatorHeight: 32 },
    /** 06-acessibilidade.md: alvo de toque mínimo. */
    touchTarget: 48,
    /** Detalhe da barbearia: foto de topo, galeria de trabalhos e cards de serviço. */
    barbershopDetail: {
        /** Fração da altura da tela ocupada pela foto de topo. */
        heroRatio: 0.29,
        heroMinHeight: 240,
        workWidth: 128,
        workHeight: 160,
        serviceImage: 84,
    },
    /** Home: foto do próximo agendamento, cards de categoria, de barbearia e de inspiração. */
    home: {
        appointmentImage: 88,
        /** Chips de categoria (estilo abas de filtro): cápsula com a largura do texto. */
        categoryChipHeight: 36,
        barbershopImageWidth: "36%",
        barbershopMinHeight: 120,
        inspirationWidth: 156,
        inspirationHeight: 196,
        statusDot: 8,
    },
    /** agenda.md (aba Trabalho): marca de dia com horários, coluna da hora, trilho da linha do tempo e bottom sheet. */
    agenda: {
        dayMark: 4,
        timeColumn: 48,
        timelineRail: 2,
        sheetHandleWidth: 32,
        sheetHandleHeight: 4,
        /** Fração máxima da altura da tela ocupada pelo bottom sheet. */
        sheetMaxRatio: 0.85,
        /** Arrasto (dp) a partir do qual soltar o sheet fecha. */
        sheetDismissDrag: 96,
    },
} as const;

export type AvatarSize = keyof typeof componentSizes.avatar;

// --- cores de status de agendamento ------------------------------------------

/**
 * 05-padroes.md, padrão 7: verde de confirmação green-600 (#198344, 4,8:1 com branco), também
 * usado no "Aberto agora". Pendente e cancelado reaproveitam papéis do esquema.
 */
export const statusColors = {
    confirmed: { container: "#198344", content: "#FFFFFF" },
    /** Pendente e aguardando o cliente: âmbar (amber-200 com amber-900, 9,1:1). */
    pending: { container: "#FFDF99", content: "#4D3300" },
} as const;

/**
 * Véu sobre fotos (02-tokens.md, "Sobreposição"): escurece a base das fotos das Inspirações para
 * o nome em branco ficar legível, igual nos dois temas. statusTint é o fundo tonal do selo
 * "Aberto agora" (verde de statusColors com essa opacidade sobre o card).
 */
export const overlay = {
    scrim: "#000000",
    scrimOpacity: 0.55,
    onScrim: "#FFFFFF",
    statusTint: 0.12,
    /** Arcos decorativos do cabeçalho do Início: bege claro nessa opacidade sobre o marrom. */
    headerPattern: 0.18,
    /** Fundo dos botões redondos sobre fotos (ex.: voltar no detalhe da barbearia). */
    controlScrim: 0.45,
} as const;
