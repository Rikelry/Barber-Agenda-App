import { Platform, Pressable, View } from "react-native";
import { useDesignSystem } from "@/view/components/themeProvider";
import { Typography } from "@/view/components/typography";
import {
    buttonSizes,
    getButtonColors,
    getButtonStyle,
} from "@/view/components/button/Button.styles";
import type { ButtonProps } from "@/view/components/button/Button.types";
import { getHitSlop } from "@/view/theme";

export const Button = ({
    children,
    variant = "filled",
    size = "small",
    shape = "round",
    leadingIcon,
    trailingIcon,
    fullWidth = false,
    disabled = false,
    typographyVariant,
    style,
    accessibilityRole = "button",
    hitSlop: customHitSlop,
    ...pressableProps
}: ButtonProps) => {
    const { theme } = useDesignSystem();

    const colors = getButtonColors({
        theme,
        variant,
        disabled,
    });

    const hasLeading = Boolean(leadingIcon);
    const hasTrailing = Boolean(trailingIcon);
    const sizeConfig = buttonSizes[size];
    const resolvedTypography = typographyVariant ?? sizeConfig.typography;

    const baseStyle = getButtonStyle({
        theme,
        variant,
        size,
        shape,
        disabled,
        hasLeadingIcon: hasLeading,
        hasTrailingIcon: hasTrailing,
    });

    // Enforce 48dp on Android / 44pt on iOS accessibility touch target
    const autoHitSlop = getHitSlop(0, sizeConfig.height);
    const hitSlop = customHitSlop ?? autoHitSlop;

    const renderIcon = (iconProp: typeof leadingIcon) => {
        if (!iconProp) return null;
        if (typeof iconProp === "function") {
            return iconProp(colors.contentColor);
        }
        return iconProp;
    };

    return (
        <Pressable
            {...pressableProps}
            disabled={disabled}
            accessibilityRole={accessibilityRole}
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
                    width: fullWidth ? "100%" : undefined,
                    // iOS subtle native highlight feedback (Android uses native ripple)
                    opacity: Platform.OS === "ios" && pressed && !disabled ? 0.75 : 1,
                },
                style,
            ]}
        >
            {hasLeading && (
                <View
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {renderIcon(leadingIcon)}
                </View>
            )}

            <Typography
                variant={resolvedTypography}
                color="onSurface"
                weight="500"
                style={{
                    color: colors.contentColor,
                }}
            >
                {children}
            </Typography>

            {hasTrailing && (
                <View
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {renderIcon(trailingIcon)}
                </View>
            )}
        </Pressable>
    );
}
