import { Platform, Pressable, View } from "react-native";
import { useDesignSystem } from "../../providers/DesignSystemProvider";
import { Typography } from "../typography";
import { getFABColors } from "./FAB.styles";
import type { ExtendedFABProps } from "./FAB.types";

export function ExtendedFAB({
    label,
    icon,
    variant = "primary",
    disabled = false,
    style,
    ...pressableProps
}: ExtendedFABProps) {
    const { theme } = useDesignSystem();
    const colors = getFABColors({ theme, variant, disabled });

    const elevationStyle = disabled
        ? {}
        : theme.getElevationStyle("level3", theme.colors.shadow);

    return (
        <Pressable
            {...pressableProps}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ disabled }}
            android_ripple={
                disabled || Platform.OS !== "android"
                    ? undefined
                    : {
                        color: colors.rippleColor,
                        borderless: false,
                    }
            }
            style={({ pressed }) => [
                {
                    height: 56,
                    paddingHorizontal: theme.spacing.lg,
                    borderRadius: theme.shapes.large,
                    borderCurve: "continuous",
                    backgroundColor: colors.backgroundColor,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: theme.spacing.md,
                    ...elevationStyle,
                },
                {
                    opacity: Platform.OS === "ios" && pressed && !disabled ? 0.8 : 1,
                },
                style,
            ]}
        >
            {icon && (
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                    {icon(colors.contentColor)}
                </View>
            )}

            <Typography
                variant="labelLarge"
                weight="600"
                style={{ color: colors.contentColor }}
            >
                {label}
            </Typography>
        </Pressable>
    );
}
