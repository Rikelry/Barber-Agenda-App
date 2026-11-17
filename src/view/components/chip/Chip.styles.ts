import type { ViewStyle } from "react-native";
import type { DesignTheme } from "@/view/theme";
import { hexToRgba } from "@/view/theme";
import type { ChipVariant } from "@/view/components/chip/Chip.types";

export type ChipStyleOptions = {
    theme: DesignTheme;
    variant: ChipVariant;
    selected: boolean;
    disabled: boolean;
    hasLeading: boolean;
    hasTrailing: boolean;
};

export function getChipColors({
    theme,
    selected,
    disabled,
}: {
    theme: DesignTheme;
    variant: ChipVariant;
    selected: boolean;
    disabled: boolean;
}) {
    const { colors, state } = theme;

    if (disabled) {
        return {
            backgroundColor: selected
                ? hexToRgba(colors.onSurface, state.disabledContainer)
                : "transparent",
            borderColor: selected
                ? "transparent"
                : hexToRgba(colors.onSurface, state.disabledContainer),
            contentColor: hexToRgba(colors.onSurface, state.disabledContent),
            rippleColor: "transparent",
        };
    }

    if (selected) {
        return {
            backgroundColor: colors.secondaryContainer,
            borderColor: "transparent",
            contentColor: colors.onSecondaryContainer,
            rippleColor: hexToRgba(colors.onSecondaryContainer, state.pressed),
        };
    }

    return {
        backgroundColor: "transparent",
        borderColor: colors.outlineVariant,
        contentColor: colors.onSurfaceVariant,
        rippleColor: hexToRgba(colors.onSurfaceVariant, state.pressed),
    };
}

export function getChipStyle({
    theme,
    variant,
    selected,
    disabled,
    hasLeading,
    hasTrailing,
}: ChipStyleOptions): ViewStyle {
    const chipColors = getChipColors({ theme, variant, selected, disabled });

    return {
        height: 32,
        paddingLeft: hasLeading ? theme.spacing.sm : theme.spacing.md,
        paddingRight: hasTrailing ? theme.spacing.sm : theme.spacing.md,
        borderRadius: theme.shapes.small,
        borderCurve: "continuous",
        backgroundColor: chipColors.backgroundColor,
        borderWidth: selected ? 0 : 1,
        borderColor: chipColors.borderColor,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: theme.spacing.sm,
    };
}
