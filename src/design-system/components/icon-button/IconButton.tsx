import { Platform, Pressable } from "react-native";

import { useDesignSystem } from "../../providers/DesignSystemProvider";
import { getHitSlop } from "../../utils/touchTarget";

import {
    getIconButtonColors,
    getIconButtonStyle,
    iconButtonDimensions,
} from "./IconButton.styles";

import type { IconButtonProps } from "./IconButton.types";

export function IconButton({
    icon,
    accessibilityLabel,
    variant = "standard",
    size = "small",
    shape = "round",
    selected = false,
    disabled = false,
    style,
    hitSlop: customHitSlop,
    ...pressableProps
}: IconButtonProps) {
    const { theme } = useDesignSystem();

    const colors = getIconButtonColors({
        theme,
        variant,
        disabled,
        selected,
    });

    const dim = iconButtonDimensions[size].container;

    const baseStyle = getIconButtonStyle({
        theme,
        variant,
        size,
        shape,
        disabled,
        selected,
    });

    // Enforce 48dp on Android / 44pt on iOS accessibility touch target
    const autoHitSlop = getHitSlop(dim, dim);
    const hitSlop = customHitSlop ?? autoHitSlop;

    return (
        <Pressable
            {...pressableProps}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            accessibilityState={{
                disabled,
                selected,
            }}
            hitSlop={hitSlop}
            android_ripple={
                disabled || Platform.OS !== "android"
                    ? undefined
                    : {
                        color: colors.rippleColor,
                        borderless: shape === "round",
                        radius: dim / 2 + 4,
                    }
            }
            style={({ pressed }) => [
                baseStyle,
                {
                    // iOS subtle native highlight feedback (Android uses native ripple)
                    opacity: Platform.OS === "ios" && pressed && !disabled ? 0.75 : 1,
                },
                style,
            ]}
        >
            {icon(colors.contentColor)}
        </Pressable>
    );
}
