import type { ViewStyle } from "react-native";

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
