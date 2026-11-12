import { Platform, Pressable, View } from "react-native";
import { useDesignSystem } from "@/view/components/themeProvider";
import { getCardColors, getCardStyle } from "@/view/components/card/Card.styles";
import type { CardProps } from "@/view/components/card/Card.types";

export const Card = ({
    children,
    variant = "elevated",
    onPress,
    disabled = false,
    style,
    ...viewProps
}: CardProps) => {
    const { theme } = useDesignSystem();
    const isInteractive = Boolean(onPress) && !disabled;

    const baseStyle = getCardStyle({
        theme,
        variant,
        disabled,
    });

    const colors = getCardColors({
        theme,
        variant,
        disabled,
    });

    if (isInteractive) {
        return (
            <Pressable
                onPress={onPress}
                disabled={disabled}
                accessibilityRole="button"
                accessibilityState={{ disabled }}
                android_ripple={
                    Platform.OS === "android"
                        ? {
                            color: colors.rippleColor,
                            borderless: false,
                        }
                        : undefined
                }
                style={({ pressed }) => [
                    baseStyle,
                    {
                        opacity: Platform.OS === "ios" && pressed ? 0.88 : 1,
                    },
                    style,
                ]}
            >
                {children}
            </Pressable>
        );
    }

    return (
        <View style={[baseStyle, style]} {...viewProps}>
            {children}
        </View>
    );
}
