import { Platform, Pressable } from "react-native";
import { useDesignSystem } from "../../providers/DesignSystemProvider";
import { getHitSlop } from "../../utils/touchTarget";
import { fabDimensions, getFABColors, getFABStyle } from "./FAB.styles";
import type { FABProps } from "./FAB.types";

export function FAB({
    icon,
    accessibilityLabel,
    variant = "primary",
    size = "medium",
    disabled = false,
    style,
    hitSlop: customHitSlop,
    ...pressableProps
}: FABProps) {
    const { theme } = useDesignSystem();
    const colors = getFABColors({ theme, variant, disabled });
    const config = fabDimensions[size];

    const baseStyle = getFABStyle({
        theme,
        variant,
        size,
        disabled,
    });

    const autoHitSlop = getHitSlop(config.container, config.container);
    const hitSlop = customHitSlop ?? autoHitSlop;

    return (
        <Pressable
            {...pressableProps}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={accessibilityLabel}
            accessibilityState={{ disabled }}
            hitSlop={hitSlop}
            android_ripple={
                disabled || Platform.OS !== "android"
                    ? undefined
                    : {
                        color: colors.rippleColor,
                        borderless: false,
                    }
            }
            style={({ pressed }) => [
                baseStyle,
                {
                    opacity: Platform.OS === "ios" && pressed && !disabled ? 0.8 : 1,
                },
                style,
            ]}
        >
            {icon(colors.contentColor)}
        </Pressable>
    );
}
