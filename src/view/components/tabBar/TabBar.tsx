import { Pressable, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useDesignSystem } from "@/view/components/themeProvider";
import { Icon } from "@/view/components/icon";
import { Typography } from "@/view/components/typography";
import { componentSizes, withAlpha } from "@/view/theme";

import type { TabBarProps } from "@/view/components/tabBar/TabBar.types";

/**
 * tab-bar.md: até 5 seções, alvo de toque de 48 dp. Fundo bege com cantos superiores
 * arredondados e a aba ativa em marrom, marcada por um traço abaixo do rótulo (Home redesenhada).
 */

export const TabBar = ({ items, style }: TabBarProps) => {
    const { theme } = useDesignSystem();
    const { colors, spacing } = theme;
    const insets = useSafeAreaInsets();

    return (
        <View
            accessibilityRole="tablist"
            style={[
                {
                    flexDirection: "row",
                    backgroundColor: colors.surfaceContainerHigh,
                    borderTopLeftRadius: theme.shapes.extraLarge,
                    borderTopRightRadius: theme.shapes.extraLarge,
                    paddingTop: spacing.md,
                    paddingBottom: Math.max(insets.bottom, spacing.md),
                    ...theme.getElevationStyle("level1", colors.shadow),
                },
                style,
            ]}
        >
            {items.map((item) => {
                const selected = Boolean(item.selected);
                const color = selected ? colors.primary : colors.onSurfaceVariant;
                return (
                    <Pressable
                        key={item.key}
                        accessibilityRole="tab"
                        accessibilityLabel={item.label}
                        accessibilityState={{ selected, disabled: Boolean(item.disabled) }}
                        disabled={item.disabled}
                        onPress={item.onPress}
                        android_ripple={{ color: withAlpha(colors.primary, theme.state.pressed), borderless: true }}
                        style={({ pressed }) => ({
                            flex: 1,
                            minWidth: componentSizes.touchTarget,
                            minHeight: componentSizes.touchTarget,
                            alignItems: "center",
                            gap: spacing.xs,
                            opacity: item.disabled ? theme.state.disabledContent : pressed ? 1 - theme.state.pressed : 1,
                        })}
                    >
                        <Icon name={item.icon} size={spacing.xxl} color={color} />
                        <Typography variant="labelMedium" weight={selected ? "700" : "500"} style={{ color }}>
                            {item.label}
                        </Typography>
                        <View
                            style={{
                                width: componentSizes.tabBar.indicatorWidth,
                                height: componentSizes.tabs.indicator,
                                borderRadius: theme.shapes.full,
                                backgroundColor: selected ? colors.primary : "transparent",
                            }}
                        />
                    </Pressable>
                );
            })}
        </View>
    );
}
