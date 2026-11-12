import { Platform, Pressable, View } from "react-native";
import { useDesignSystem } from "../../providers/DesignSystemProvider";
import { Typography } from "../typography";
import { getHitSlop } from "../../utils/touchTarget";
import { getChipColors, getChipStyle } from "./Chip.styles";
import type { ChipProps } from "./Chip.types";

export function Chip({
    label,
    variant = "assist",
    selected = false,
    disabled = false,
    leadingIcon,
    trailingIcon,
    onClose,
    style,
    hitSlop: customHitSlop,
    ...pressableProps
}: ChipProps) {
    const { theme } = useDesignSystem();

    const colors = getChipColors({
        theme,
        variant,
        selected,
        disabled,
    });

    const hasLeading = Boolean(leadingIcon) || (variant === "filter" && selected);
    const hasTrailing = Boolean(trailingIcon) || Boolean(onClose);

    const baseStyle = getChipStyle({
        theme,
        variant,
        selected,
        disabled,
        hasLeading,
        hasTrailing,
    });

    // 32dp height requires hitSlop to reach 48dp minimum
    const autoHitSlop = getHitSlop(0, 32);
    const hitSlop = customHitSlop ?? autoHitSlop;

    const renderLeading = () => {
        if (variant === "filter" && selected && !leadingIcon) {
            return (
                <Typography
                    variant="labelSmall"
                    style={{ color: colors.contentColor, fontWeight: "700" }}
                >
                    ✓
                </Typography>
            );
        }
        if (!leadingIcon) return null;
        if (typeof leadingIcon === "function") {
            return leadingIcon(colors.contentColor);
        }
        return leadingIcon;
    };

    const renderTrailing = () => {
        if (onClose) {
            return (
                <Pressable
                    onPress={onClose}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel="Remover"
                >
                    <Typography
                        variant="labelSmall"
                        style={{ color: colors.contentColor, fontWeight: "700" }}
                    >
                        ✕
                    </Typography>
                </Pressable>
            );
        }
        if (!trailingIcon) return null;
        if (typeof trailingIcon === "function") {
            return trailingIcon(colors.contentColor);
        }
        return trailingIcon;
    };

    return (
        <Pressable
            {...pressableProps}
            disabled={disabled}
            accessibilityRole="button"
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
                        borderless: false,
                    }
            }
            style={({ pressed }) => [
                baseStyle,
                {
                    opacity: Platform.OS === "ios" && pressed && !disabled ? 0.75 : 1,
                },
                style,
            ]}
        >
            {hasLeading && (
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    {renderLeading()}
                </View>
            )}

            <Typography
                variant="labelMedium"
                color="onSurface"
                weight={selected ? "600" : "500"}
                style={{
                    color: colors.contentColor,
                }}
            >
                {label}
            </Typography>

            {hasTrailing && (
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    {renderTrailing()}
                </View>
            )}
        </Pressable>
    );
}
