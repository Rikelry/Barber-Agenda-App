import type { ViewStyle } from "react-native";

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
