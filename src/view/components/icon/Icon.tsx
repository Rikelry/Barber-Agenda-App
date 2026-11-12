import { Text, View } from "react-native";
import { useDesignSystem } from "@/view/components/themeProvider";
import type { IconProps } from "@/view/components/icon/Icon.types";

const fallbackSymbols: Record<string, string> = {
    star: "★",
    "star.fill": "★",
    heart: "♡",
    "heart.fill": "♥",
    plus: "+",
    gear: "⚙",
    checkmark: "✓",
    close: "✕",
    calendar: "📅",
    clock: "⏱",
    person: "👤",
    search: "🔍",
    scissors: "✂",
    chevronRight: "›",
    chevronLeft: "‹",
    moreVert: "⋮",
    bell: "🔔",
};

export const Icon = ({
    name,
    size = 24,
    color,
    style,
    children,
}: IconProps) => {
    const { theme } = useDesignSystem();
    const resolvedColor = color ?? theme.colors.onSurface;

    if (children) {
        return (
            <View
                style={[
                    {
                        width: size,
                        height: size,
                        alignItems: "center",
                        justifyContent: "center",
                    },
                    style,
                ]}
            >
                {children}
            </View>
        );
    }

    const glyph = (name && fallbackSymbols[name]) ?? name ?? "•";

    return (
        <View
            style={[
                {
                    width: size,
                    height: size,
                    alignItems: "center",
                    justifyContent: "center",
                },
                style,
            ]}
        >
            <Text
                style={{
                    fontSize: Math.round(size * 0.8),
                    color: resolvedColor,
                    lineHeight: size,
                    textAlign: "center",
                }}
            >
                {glyph}
            </Text>
        </View>
    );
}
