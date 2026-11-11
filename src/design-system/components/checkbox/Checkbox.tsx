import { Platform, Pressable, View } from "react-native";
import { useDesignSystem } from "../../providers/DesignSystemProvider";
import { Typography } from "../typography";
import { getHitSlop } from "../../utils/touchTarget";
import { hexToRgba } from "../../utils/color";
import type { CheckboxProps } from "./Checkbox.types";

export function Checkbox({
    checked,
    onCheckedChange,
    label,
    disabled = false,
    style,
}: CheckboxProps) {
    const { theme } = useDesignSystem();
    const { colors, state } = theme;

    const handlePress = () => {
        if (!disabled && onCheckedChange) {
            onCheckedChange(!checked);
        }
    };

    const boxSize = 18;

    const boxBg = disabled
        ? checked
            ? hexToRgba(colors.onSurface, state.disabledContainer)
            : "transparent"
        : checked
            ? colors.primary
            : "transparent";

    const borderColor = disabled
        ? hexToRgba(colors.onSurface, state.disabledContainer)
        : checked
            ? colors.primary
            : colors.outline;

    const checkmarkColor = disabled
        ? hexToRgba(colors.surface, state.disabledContent)
        : colors.onPrimary;

    const hitSlop = getHitSlop(boxSize, boxSize);

    return (
        <Pressable
            onPress={handlePress}
            disabled={disabled}
            accessibilityRole="checkbox"
            accessibilityState={{
                checked,
                disabled,
            }}
            hitSlop={label ? undefined : hitSlop}
            style={({ pressed }) => [
                {
                    flexDirection: "row",
                    alignItems: "center",
                    gap: theme.spacing.md,
                    opacity: Platform.OS === "ios" && pressed && !disabled ? 0.75 : 1,
                },
                style,
            ]}
        >
            <View
                style={{
                    width: boxSize,
                    height: boxSize,
                    borderRadius: 3,
                    borderWidth: 2,
                    borderColor,
                    backgroundColor: boxBg,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {checked && (
                    <Typography
                        variant="labelSmall"
                        style={{
                            color: checkmarkColor,
                            fontSize: 12,
                            lineHeight: 14,
                            fontWeight: "800",
                        }}
                    >
                        ✓
                    </Typography>
                )}
            </View>

            {label && (
                <Typography
                    variant="bodyMedium"
                    color={disabled ? "onSurfaceVariant" : "onSurface"}
                >
                    {label}
                </Typography>
            )}
        </Pressable>
    );
}
