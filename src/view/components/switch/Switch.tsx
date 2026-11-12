import { Platform, Pressable, View } from "react-native";
import { useDesignSystem } from "@/view/components/themeProvider";
import { getHitSlop , hexToRgba } from "@/view/theme";
import type { SwitchProps } from "@/view/components/switch/Switch.types";

export const Switch = ({
    value,
    onValueChange,
    disabled = false,
    style,
}: SwitchProps) => {
    const { theme } = useDesignSystem();
    const { colors, state } = theme;

    const handlePress = () => {
        if (!disabled && onValueChange) {
            onValueChange(!value);
        }
    };

    const trackWidth = 52;
    const trackHeight = 32;
    const thumbSize = value ? 24 : 16;
    const thumbOffset = value ? trackWidth - thumbSize - 4 : 4;

    const trackColor = disabled
        ? hexToRgba(colors.surfaceContainerHighest, state.disabledContainer)
        : value
            ? colors.primary
            : colors.surfaceContainerHighest;

    const borderColor = disabled
        ? hexToRgba(colors.outline, state.disabledContainer)
        : value
            ? "transparent"
            : colors.outline;

    const thumbColor = disabled
        ? hexToRgba(colors.onSurface, state.disabledContent)
        : value
            ? colors.onPrimary
            : colors.outline;

    const hitSlop = getHitSlop(trackWidth, trackHeight);

    return (
        <Pressable
            onPress={handlePress}
            disabled={disabled}
            accessibilityRole="switch"
            accessibilityState={{
                checked: value,
                disabled,
            }}
            hitSlop={hitSlop}
            style={({ pressed }) => [
                {
                    width: trackWidth,
                    height: trackHeight,
                    borderRadius: theme.shapes.large,
                    borderCurve: "continuous",
                    backgroundColor: trackColor,
                    borderWidth: value ? 0 : 2,
                    borderColor,
                    justifyContent: "center",
                    opacity: Platform.OS === "ios" && pressed && !disabled ? 0.8 : 1,
                },
                style,
            ]}
        >
            <View
                style={{
                    width: thumbSize,
                    height: thumbSize,
                    borderRadius: thumbSize / 2,
                    backgroundColor: thumbColor,
                    transform: [{ translateX: thumbOffset }],
                }}
            />
        </Pressable>
    );
}
